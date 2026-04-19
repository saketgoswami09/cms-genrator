import { useState, useLayoutEffect, useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import gsap from "gsap";
import {
  ImageIcon, Download, RefreshCw, Wand2, Settings2, Sparkles,
  History, Dice5, Clipboard, Eraser,
} from "lucide-react";

import { IMAGE_RESOLUTION } from "@/constants/image";
import { generateImage } from "@/services/image";
import { downloadImage } from "@/utils/global";
import ImageHistory from "@/components/ui/ImageHistory";
import { CustomSelect } from "@/components/ui/CustomSelect";
import PageShell from "@/components/ui/PageShell";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import SectionDivider from "@/components/ui/SectionDivider";

const SAMPLE_PROMPTS = [
  "A futuristic city with flying cars at sunset, cyberpunk style, cinematic lighting",
  "A cute isometric 3d render of a cozy living room with plants and a cat",
  "Oil painting of a cottage in the woods during autumn, warm colors, detailed",
  "Portrait of an astronaut floating in a nebula, digital art, vibrant colors",
  "Minimalist logo design of a fox, geometric shapes, orange and white",
];

const schema = z.object({
  resolution: z.string().min(1, "Resolution is required"),
  prompt: z.string().min(1, "Prompt is required"),
});

export default function GenerateImage() {
  const [generatedImages, setGeneratedImages] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const pageRef = useRef(null);
  const diceRef = useRef(null);

  // Staggered page entrance
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from(".gsap-header", { y: -30, opacity: 0, duration: 0.8, ease: "power3.out" });
      tl.from(".gsap-panel", { y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" }, "-=0.4");
    }, pageRef);
    return () => ctx.revert();
  }, []);

  // Bounce effect on generated result
  useEffect(() => {
    if (generatedImages) {
      gsap.fromTo(
        ".gsap-result-image",
        { scale: 0.95, opacity: 0, filter: "blur(10px)" },
        { scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.6, ease: "back.out(1.7)" }
      );
    }
  }, [generatedImages]);

  const {
    control, register, handleSubmit,
    formState: { errors }, reset, watch, setValue,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { resolution: IMAGE_RESOLUTION?.[0]?.value || "512x512" },
  });

  const promptValue = watch("prompt") || "";

  const formHandler = async (data) => {
    setIsSubmitting(true);
    setError(null);
    setGeneratedImages(null);

    try {
      const res = await generateImage(data);
      setGeneratedImages(res?.data?.data?.image_url);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      setError("Failed to generate image. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSurpriseMe = () => {
    gsap.to(diceRef.current, { rotation: "+=360", duration: 0.5, ease: "back.out" });
    const random = SAMPLE_PROMPTS[Math.floor(Math.random() * SAMPLE_PROMPTS.length)];
    setValue("prompt", random, { shouldValidate: true });
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setValue("prompt", text, { shouldValidate: true });
    } catch (err) {
      console.error(err);
    }
  };

  const handleClear = () => setValue("prompt", "");

  const handleGenerateNew = () => {
    setGeneratedImages(null);
    setError(null);
    reset({ ...watch(), prompt: "" });
  };

  return (
    <PageShell>
      <div ref={pageRef} className="px-4 py-12">
        {/* HEADER */}
        <div className="gsap-header mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-white/10 ring-1 ring-white/10 text-purple-400">
            <ImageIcon size={24} />
          </div>
          <h1 className="text-3xl md:text-4xl font-heading tracking-tight text-white">
            AI Image Generator
          </h1>
          <p className="mt-3 text-lg text-white/40">
            Turn your text descriptions into high-quality visuals instantly.
          </p>
        </div>

        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          {/* LEFT PANEL */}
          <div className="gsap-panel lg:col-span-4 flex flex-col h-full">
            <GlassCard>
              <div className="px-5 py-4 border-b border-white/10 flex items-center gap-2 text-white/50 text-xs font-semibold uppercase tracking-wider">
                <Settings2 size={14} />
                <span>Configuration</span>
              </div>

              <form onSubmit={handleSubmit(formHandler)} className="flex flex-col">
                {/* Resolution */}
                <div className="p-5 border-b border-white/5">
                  <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">
                    Resolution
                  </label>
                  <div className="p-5 border-b border-white/5">
                    <Controller
                      name="resolution"
                      control={control}
                      render={({ field }) => (
                        <CustomSelect
                          options={IMAGE_RESOLUTION}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                  {errors.resolution && (
                    <p className="mt-1 text-xs text-red-500">{errors.resolution.message}</p>
                  )}
                </div>

                {/* Prompt */}
                <div className="flex-1 p-5 bg-white/[0.02]">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                      Prompt
                    </label>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={handleSurpriseMe}
                        className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 rounded transition"
                        title="Random Prompt"
                      >
                        <div ref={diceRef}><Dice5 size={12} /></div>
                        Surprise Me
                      </button>
                      <button type="button" onClick={handlePaste} className="p-1.5 text-white/30 hover:text-white/60 hover:bg-white/10 rounded transition">
                        <Clipboard size={12} />
                      </button>
                      {promptValue.length > 0 && (
                        <button type="button" onClick={handleClear} className="p-1.5 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded transition">
                          <Eraser size={12} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="relative">
                    <textarea
                      {...register("prompt")}
                      rows={6}
                      placeholder="A futuristic city with flying cars at sunset..."
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white placeholder:text-white/30 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all resize-none"
                    />
                    <div className="absolute bottom-3 right-3 text-[10px] font-medium text-white/20">
                      {promptValue.length} chars
                    </div>
                  </div>
                  {errors.prompt && (
                    <p className="mt-1 text-xs text-red-500 animate-pulse">{errors.prompt.message}</p>
                  )}

                  <GradientButton
                    type="submit"
                    loading={isSubmitting}
                    loadingText="Dreaming..."
                    disabled={!!generatedImages}
                    className="mt-4 from-purple-600 to-blue-600 shadow-purple-500/20"
                  >
                    <span>Generate Image</span>
                    <Wand2 size={16} className="text-white/60 group-hover:text-white transition-colors" />
                  </GradientButton>
                </div>
              </form>
              {error && (
                <div className="px-5 pb-5 text-center text-sm text-red-500">{error}</div>
              )}
            </GlassCard>
          </div>

          {/* RIGHT PANEL */}
          <div className="gsap-panel lg:col-span-8 h-full">
            <GlassCard active={!!generatedImages} className="h-full min-h-125 flex flex-col">
              <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider">
                  <Sparkles size={14} /> <span>Preview</span>
                </div>
                {generatedImages && (
                  <span className="text-xs font-medium text-white/40 bg-white/10 px-2 py-1 rounded">
                    {watch("resolution")?.replace("x", " x ")}
                  </span>
                )}
              </div>

              <div className="flex-1 p-6 flex flex-col items-center justify-center bg-white/[0.02]">
                {isSubmitting ? (
                  <div className="w-full h-full max-w-md aspect-square rounded-2xl bg-white/5 border border-white/10 p-2">
                    <div className="w-full h-full rounded-xl bg-white/5 animate-pulse flex items-center justify-center">
                      <ImageIcon className="text-white/20 animate-bounce" size={48} />
                    </div>
                  </div>
                ) : generatedImages ? (
                  <div className="gsap-result-image w-full flex flex-col items-center">
                    <div className="relative group rounded-lg overflow-hidden shadow-sm border border-white/10">
                      <img src={generatedImages} alt="AI Generated" className="max-h-150 w-auto object-contain" />
                    </div>
                    <div className="flex w-full max-w-sm gap-3 mt-8">
                      <button
                        onClick={() => downloadImage(generatedImages)}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 py-3 text-sm font-medium text-white/70 hover:bg-white/10 transition-all"
                      >
                        <Download size={16} /> Download
                      </button>
                      <button
                        onClick={handleGenerateNew}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 text-sm font-medium text-white hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/20 transition-all"
                      >
                        <RefreshCw size={16} /> Generate New
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center max-w-sm">
                    <div className="mx-auto w-20 h-20 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6">
                      <ImageIcon className="text-white/20" size={32} />
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2">No image generated yet</h3>
                    <p className="text-sm text-white/40 leading-relaxed">
                      Configure your settings on the left and hit generate to see the magic happen.
                    </p>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* DIVIDER & HISTORY */}
      <SectionDivider icon={History} label="Recent Generations" />
      <div className="pb-20">
        <ImageHistory refreshTrigger={refreshTrigger} />
      </div>
    </PageShell>
  );
}
