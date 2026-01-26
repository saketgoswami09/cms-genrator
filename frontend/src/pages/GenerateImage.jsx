import React, { useState, useLayoutEffect, useEffect, useRef } from "react";
import { IMAGE_RESOLUTION } from "../../constants/constant";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import gsap from "gsap";
import { generateImage } from "../../services/image";
import { 
  ImageIcon, Download, RefreshCw, Wand2, Settings2, Sparkles, History,
  Dice5, Clipboard, Eraser, Layers 
} from "lucide-react";
import ImageHistory from "../components/ui/ImageHistory"; 

const SAMPLE_PROMPTS = [
  "A futuristic city with flying cars at sunset, cyberpunk style, cinematic lighting",
  "A cute isometric 3d render of a cozy living room with plants and a cat",
  "Oil painting of a cottage in the woods during autumn, warm colors, detailed",
  "Portrait of an astronaut floating in a nebula, digital art, vibrant colors",
  "Minimalist logo design of a fox, geometric shapes, orange and white"
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
  const diceRef = useRef(null); // Ref for the dice icon

  // 🔥 ANIMATION 1: Staggered Page Entrance
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // 1. Header slides down
      tl.from(".gsap-header", { 
        y: -30, 
        opacity: 0, 
        duration: 0.8, 
        ease: "power3.out" 
      });

      // 2. Panels slide up (Staggered)
      tl.from(".gsap-panel", { 
        y: 40, 
        opacity: 0, 
        duration: 0.8, 
        stagger: 0.15, // Delay between left & right panel
        ease: "power3.out" 
      }, "-=0.4"); // Start slightly before header finishes

    }, pageRef);
    return () => ctx.revert();
  }, []);

  // 🔥 ANIMATION 2: Bounce Effect on Result
  useEffect(() => {
    if (generatedImages) {
      gsap.fromTo(".gsap-result-image", 
        { scale: 0.95, opacity: 0, filter: "blur(10px)" }, 
        { scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.6, ease: "back.out(1.7)" }
      );
    }
  }, [generatedImages]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { resolution: IMAGE_RESOLUTION?.[0]?.value || "512x512" }
  });

  const promptValue = watch("prompt") || "";

  const formhandler = async (data) => {
    setIsSubmitting(true);
    setError(null);
    setGeneratedImages(null);

    try {
      const res = await generateImage(data);
      setGeneratedImages(res?.data?.image?.image_url);
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error(err)
      setError("Failed to generate image. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSurpriseMe = () => {
    // 🔥 ANIMATION 3: Spin the Dice
    gsap.to(diceRef.current, { rotation: "+=360", duration: 0.5, ease: "back.out" });

    const random = SAMPLE_PROMPTS[Math.floor(Math.random() * SAMPLE_PROMPTS.length)];
    setValue("prompt", random, { shouldValidate: true });
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setValue("prompt", text, { shouldValidate: true });
    } catch (err) { console.error(err); }
  };

  const handleClear = () => setValue("prompt", "");

  const handleGenerateNew = () => {
    setGeneratedImages(null);
    setError(null);
    reset({ ...watch(), prompt: "" });
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
      console.log(err);
      
      setError("Download failed. Try right-clicking the image.");
    }
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-[#F9FAFB] font-sans relative overflow-hidden">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.4]" 
           style={{ backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      <div className="relative z-10 px-4 py-12">
        
        {/* HEADER (Animated Class: gsap-header) */}
        <div className="gsap-header mb-10 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 text-purple-600">
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
            
            {/* LEFT PANEL (Animated Class: gsap-panel) */}
            <div className="gsap-panel lg:col-span-4 flex flex-col h-full">
            <div className="rounded-2xl bg-white shadow-xl shadow-gray-200/50 ring-1 ring-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 bg-white flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                   <Settings2 size={14} />
                   <span>Configuration</span>
                </div>

                <form onSubmit={handleSubmit(formhandler)} className="flex flex-col">
                    {/* Resolution */}
                    <div className="p-5 border-b border-gray-50">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Resolution</label>
                        <div className="relative">
                            <select {...register("resolution")} className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 pl-10 text-sm text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all cursor-pointer hover:border-gray-300">
                                {IMAGE_RESOLUTION.map((res) => <option key={res.value} value={res.value}>{res.label}</option>)}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 text-gray-400"><Layers size={16} /></div>
                        </div>
                        {errors.resolution && <p className="mt-1 text-xs text-red-500">{errors.resolution.message}</p>}
                    </div>

                    {/* Prompt */}
                    <div className="flex-1 p-5 bg-gray-50/30">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Prompt</label>
                            <div className="flex items-center gap-1">
                                <button type="button" onClick={handleSurpriseMe} className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded transition" title="Random Prompt">
                                    <div ref={diceRef}><Dice5 size={12} /></div> Surprise Me
                                </button>
                                <button type="button" onClick={handlePaste} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition"><Clipboard size={12} /></button>
                                {promptValue.length > 0 && <button type="button" onClick={handleClear} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition"><Eraser size={12} /></button>}
                            </div>
                        </div>

                        <div className="relative">
                            <textarea {...register("prompt")} rows={6} placeholder="A futuristic city with flying cars at sunset..." className="w-full rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all resize-none shadow-sm" />
                            <div className="absolute bottom-3 right-3 text-[10px] font-medium text-gray-300">{promptValue.length} chars</div>
                        </div>
                        {errors.prompt && <p className="mt-1 text-xs text-red-500 animate-pulse">{errors.prompt.message}</p>}
                        
                        <button type="submit" disabled={isSubmitting || generatedImages} className="w-full mt-4 group relative flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 py-3.5 text-sm font-semibold text-white shadow-lg shadow-gray-900/20 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed">
                            {isSubmitting ? <><RefreshCw className="animate-spin" size={18} /><span>Dreaming...</span></> : <><span>Generate Image</span><Wand2 size={16} className="text-gray-400 group-hover:text-white transition-colors" /></>}
                        </button>
                    </div>
                </form>
                {error && <div className="px-5 pb-5 text-center text-sm text-red-500">{error}</div>}
            </div>
            </div>

            {/* RIGHT PANEL (Animated Class: gsap-panel) */}
            <div className="gsap-panel lg:col-span-8 h-full">
            <div className={`h-full min-h-125 rounded-2xl bg-white shadow-xl shadow-gray-200/50 ring-1 ring-gray-100 transition-all duration-500 ${generatedImages ? 'ring-2 ring-purple-500/20' : ''} flex flex-col overflow-hidden`}>
                
                <div className="px-5 py-3 border-b border-gray-100 bg-white flex items-center justify-between">
                    <div className="flex items-center gap-2 text-purple-600 text-xs font-semibold uppercase tracking-wider">
                        <Sparkles size={14} /> <span>Preview</span>
                    </div>
                    {generatedImages && <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded">1024 x 1024</span>}
                </div>

                <div className="flex-1 p-6 flex flex-col items-center justify-center bg-gray-50/30">
                    {isSubmitting ? (
                        <div className="w-full h-full max-w-md aspect-square rounded-2xl bg-white border border-gray-100 p-2 shadow-sm">
                           <div className="w-full h-full rounded-xl bg-gray-50 animate-pulse flex items-center justify-center">
                               <ImageIcon className="text-gray-200 animate-bounce" size={48} />
                           </div>
                        </div>
                    ) : generatedImages ? (
                    <div className="gsap-result-image w-full flex flex-col items-center">
                        <div className="relative group rounded-lg overflow-hidden shadow-sm border border-gray-200">
                            <img src={generatedImages} alt="AI Generated" className="max-h-150 w-auto object-contain" />
                        </div>
                        <div className="flex w-full max-w-sm gap-3 mt-8">
                            <button onClick={handleDownload} className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white border border-gray-200 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
                                <Download size={16} /> Download
                            </button>
                            <button onClick={handleGenerateNew} className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 text-sm font-medium text-white hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/20 transition-all">
                                <RefreshCw size={16} /> Generate New
                            </button>
                        </div>
                    </div>
                    ) : (
                    <div className="text-center max-w-sm">
                        <div className="mx-auto w-20 h-20 bg-white border border-gray-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                            <ImageIcon className="text-gray-300" size={32} />
                        </div>
                        <h3 className="text-gray-900 font-semibold text-lg mb-2">No image generated yet</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">Configure your settings on the left and hit generate to see the magic happen.</p>
                    </div>
                    )}
                </div>
            </div>
            </div>
        </div>
      </div>

      {/* DIVIDER & HISTORY */}
      <div className="relative py-8">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
        <div className="relative flex justify-center"><span className="bg-[#F9FAFB] px-4 text-sm text-gray-400 flex items-center gap-2"><History size={16} /> Recent Generations</span></div>
      </div>
      <div className="bg-[#F9FAFB] pb-20">
         <ImageHistory refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
}