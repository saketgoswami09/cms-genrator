import React, { useState, useLayoutEffect, useRef } from "react";
import { IMAGE_RESOLUTION } from "../constant";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import gsap from "gsap";
import { generateImage } from "../../services/image";
import { 
  ImageIcon, 
  Download, 
  RefreshCw, 
  Wand2, 
  Settings2, 
  Sparkles,
  History
} from "lucide-react";
// IMPORT YOUR HISTORY COMPONENT
import ImageHistory from "../components/ui/ImageHistory"; 

const schema = z.object({
  resolution: z.string().min(1, "Resolution is required"),
  prompt: z.string().min(1, "Prompt is required"),
});

export default function GenerateImage() {
  const [generatedImages, setGeneratedImages] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const pageRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(pageRef.current, {
        opacity: 0,
        y: 16,
        duration: 0.6,
        ease: "power3.out",
      });
    });
    return () => ctx.revert();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      resolution: IMAGE_RESOLUTION?.[0]?.value || "512x512",
    }
  });

  const formhandler = async (data) => {
    setIsSubmitting(true);
    setError(null);
    setGeneratedImages(null);

    try {
      const res = await generateImage(data);
      setGeneratedImages(res?.data?.image?.image_url);
      
      // OPTIONAL: Here you would typically add the new image to your history state
      // e.g., setHistory(prev => [newItem, ...prev])
    } catch (err) {
      console.error("error in generating image", err);
      setError("Failed to generate image. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateNew = () => {
    setGeneratedImages(null);
    setError(null);
    reset({
        ...watch(),
        prompt: "" 
    });
  };

  const handleDownload = async () => {
    if (!generatedImages) return;
    try {
      const response = await fetch(generatedImages);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ai-generated-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
      setError("Download failed. Try right-clicking the image.");
    }
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-gray-50/50 font-sans">
      
      {/* =========================================
          SECTION 1: GENERATOR
      ========================================= */}
      <div className="px-4 py-12">
        {/* HEADER */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-purple-50 text-purple-600">
            <ImageIcon size={24} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            AI Image Generator
            </h1>
            <p className="mt-3 text-lg text-gray-500">
            Turn your text descriptions into high-quality visuals instantly.
            </p>
        </div>

        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
            
            {/* LEFT: CONTROLS */}
            <div className="lg:col-span-4 flex flex-col h-full">
            <div className="rounded-2xl bg-white p-1 shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2 text-gray-700 font-medium text-sm">
                <Settings2 size={16} />
                <span>Configuration</span>
                </div>

                <form onSubmit={handleSubmit(formhandler)} className="p-5 space-y-6">
                    <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Resolution
                    </label>
                    <div className="relative">
                        <select
                        {...register("resolution")}
                        className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-shadow cursor-pointer hover:border-gray-300"
                        >
                        {IMAGE_RESOLUTION.map((res) => (
                            <option key={res.value} value={res.value}>
                            {res.label}
                            </option>
                        ))}
                        </select>
                    </div>
                    {errors.resolution && <p className="text-xs text-red-500">{errors.resolution.message}</p>}
                    </div>

                    <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Prompt
                    </label>
                    <textarea
                        {...register("prompt")}
                        rows={6}
                        placeholder="A futuristic city with flying cars at sunset, cyberpunk style, cinematic lighting..."
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all resize-none"
                    />
                    {errors.prompt && <p className="text-xs text-red-500">{errors.prompt.message}</p>}
                    </div>

                    <button
                    type="submit"
                    disabled={isSubmitting || generatedImages}
                    className="w-full group relative flex items-center justify-center gap-2 rounded-xl bg-gray-900 py-3.5 text-sm font-semibold text-white transition-all hover:bg-gray-800 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                    >
                    {isSubmitting ? (
                        <>
                        <RefreshCw className="animate-spin" size={18} />
                        <span>Dreaming...</span>
                        </>
                    ) : (
                        <>
                        <span>Generate Image</span>
                        <Wand2 size={16} className="text-gray-400 group-hover:text-white transition-colors" />
                        </>
                    )}
                    </button>
                </form>
                {error && <div className="px-5 pb-5 text-center text-sm text-red-500">{error}</div>}
            </div>
            </div>

            {/* RIGHT: RESULT */}
            <div className="lg:col-span-8 h-full">
            <div className={`h-full min-h-[500px] rounded-2xl border border-gray-200 bg-white p-1 shadow-sm transition-all duration-500 ${generatedImages ? 'ring-4 ring-purple-50/50 border-purple-100' : ''} flex flex-col`}>
                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-700 font-medium text-sm">
                    <Sparkles size={16} className="text-purple-500" />
                    <span>Preview</span>
                    </div>
                    {generatedImages && (
                    <span className="text-xs text-gray-400 font-medium">1024 x 1024</span>
                    )}
                </div>

                <div className="flex-1 p-5 flex flex-col items-center justify-center bg-gray-50/30">
                    {isSubmitting ? (
                    <div className="w-full h-full aspect-square max-h-[500px] rounded-xl bg-gray-100 animate-pulse flex items-center justify-center">
                        <ImageIcon className="text-gray-200" size={48} />
                    </div>
                    ) : generatedImages ? (
                    <div className="w-full h-full flex flex-col items-center animate-in fade-in zoom-in duration-500">
                        <img
                        src={generatedImages}
                        alt="AI Generated"
                        className="w-full h-auto max-h-[600px] object-contain rounded-lg shadow-sm border border-gray-100"
                        />
                        <div className="flex w-full max-w-md gap-3 mt-6">
                        <button
                            onClick={handleDownload}
                            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white border border-gray-200 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
                        >
                            <Download size={16} />
                            Download
                        </button>
                        <button
                            onClick={handleGenerateNew}
                            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 text-sm font-medium text-white hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/20 transition-all"
                        >
                            <RefreshCw size={16} />
                            Generate New
                        </button>
                        </div>
                    </div>
                    ) : (
                    <div className="text-center max-w-sm">
                        <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <ImageIcon className="text-gray-400" size={32} />
                        </div>
                        <h3 className="text-gray-900 font-medium mb-1">No image generated yet</h3>
                        <p className="text-sm text-gray-500">
                        Configure your settings on the left and hit generate to see the magic happen.
                        </p>
                    </div>
                    )}
                </div>
            </div>
            </div>
        </div>
      </div>

      {/* =========================================
          SECTION DIVIDER
      ========================================= */}
      <div className="relative py-8">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center">
            <span className="bg-gray-50 px-4 text-sm text-gray-400 flex items-center gap-2">
                <History size={16} />
                Recent Generations
            </span>
        </div>
      </div>

      {/* =========================================
          SECTION 2: HISTORY
      ========================================= */}
      <div className="bg-gray-50/50 pb-20">
         {/* We simply render the component here */}
         <ImageHistory />
      </div>

    </div>
  );
}