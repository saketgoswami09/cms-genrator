import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import gsap from "gsap";
import { rewriteContent } from "../../services/content"; // Check your path
import { toast } from "react-toastify";
import { 
  Wand2, 
  Copy, 
  RefreshCw, 
  Check, 
  Sparkles, 
  FileText,
  AlignLeft
} from "lucide-react";

// --- VALIDATION SCHEMA ---
const schema = z.object({
  content: z.string().min(1, "Content is required"),
  tone: z.string().default("Professional"),
});

const TONE_OPTIONS = ["Professional", "Casual", "Enthusiastic", "Concise", "Expanded"];

export default function Rewrite() {
  const [rewrittenText, setRewrittenText] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  
  const pageRef = useRef(null);
  const resultRef = useRef(null); // Ref for the result container

  // 1. Page Entrance Animation
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

  // 2. Result Reveal Animation (Triggered when rewrittenText changes)
  useEffect(() => {
    if (!rewrittenText || !resultRef.current) return;

    const ctx = gsap.context(() => {
      // Animate the text box
      gsap.fromTo(
        ".result-content",
        { opacity: 0, y: 20, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6, ease: "power3.out" }
      );

      // Animate the buttons (staggered delay)
      gsap.fromTo(
        ".result-actions",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, delay: 0.3, ease: "power2.out" }
      );
    }, resultRef); // Scope selector to resultRef

    return () => ctx.revert();
  }, [rewrittenText]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { tone: "Professional" }
  });

  const currentTone = watch("tone");

  const formhandler = async (data) => {
    setIsSubmitting(true);
    setError(null);
    setRewrittenText(null);

    try {
      const res = await rewriteContent({ 
        content: data.content, 
        tone: data.tone 
      });
      setRewrittenText(res?.data?.content);
    } catch (err) {
      console.error("Rewrite failed", err);
      setError("Failed to rewrite content. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = async () => {
    if (!rewrittenText) return;
    try {
      await navigator.clipboard.writeText(rewrittenText);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-gray-50/50 px-4 py-12 font-sans">
      
      {/* HEADER */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-blue-50 text-blue-600">
          <Wand2 size={24} />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
          Rewrite Content
        </h1>
        <p className="mt-3 text-lg text-gray-500">
          Refine your text instantly using AI. Choose a tone and let the magic happen.
        </p>
      </div>

      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
        
        {/* LEFT COLUMN: INPUT */}
        <div className="flex flex-col h-full">
          <div className="flex-1 rounded-2xl bg-white p-1 shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-700 font-medium text-sm">
                <FileText size={16} />
                <span>Original Text</span>
              </div>
              <div className="relative">
                <select 
                  {...register("tone")}
                  className="appearance-none bg-white border border-gray-200 text-gray-700 text-xs font-medium py-1.5 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer hover:border-gray-300 transition-colors"
                >
                  {TONE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <svg className="h-3 w-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(formhandler)} className="flex-1 flex flex-col">
              <div className="flex-1 relative">
                <textarea
                  {...register("content")}
                  className="w-full h-full p-5 text-gray-800 placeholder:text-gray-400 text-base resize-none focus:outline-none bg-transparent"
                  placeholder="Paste your content here..."
                />
              </div>
              
              {errors.content && (
                <div className="px-5 pb-2 text-sm text-red-500 animate-pulse">
                  {errors.content.message}
                </div>
              )}

              <div className="p-4 border-t border-gray-100 bg-gray-50/30">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full group relative flex items-center justify-center gap-2 rounded-xl bg-gray-900 py-3.5 text-sm font-semibold text-white transition-all hover:bg-gray-800 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="animate-spin" size={18} />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Rewrite as {currentTone}</span>
                      <Wand2 size={16} className="text-gray-400 group-hover:text-white transition-colors" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          {error && <p className="mt-3 text-center text-sm text-red-500">{error}</p>}
        </div>

        {/* RIGHT COLUMN: RESULT */}
        <div className="h-full">
           <div 
             ref={resultRef} // ATTACH RESULT REF HERE
             className={`h-full rounded-2xl border border-gray-200 bg-white p-1 shadow-sm transition-all duration-500 ${rewrittenText ? 'ring-4 ring-blue-50/50 border-blue-100' : ''}`}
           >
             
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2 text-gray-700 font-medium text-sm">
               <Sparkles size={16} className="text-purple-500" />
               <span>AI Output</span>
            </div>

            <div className="p-5 min-h-[400px] flex flex-col">
              {isSubmitting ? (
                // SKELETON LOADER
                <div className="space-y-4 animate-pulse pt-2">
                  <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                  <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                  <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                </div>
              ) : rewrittenText ? (
                // SUCCESS STATE
                <>
                  {/* Added 'result-content' class for GSAP */}
                  <div className="result-content flex-1 text-base leading-relaxed text-gray-800 whitespace-pre-wrap">
                    {rewrittenText}
                  </div>
                  
                  {/* Added 'result-actions' class for GSAP */}
                  <div className="result-actions mt-8 flex gap-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={handleCopy}
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                      {copied ? <Check size={16} className="text-green-600"/> : <Copy size={16} />}
                      {copied ? "Copied" : "Copy Text"}
                    </button>
                    
                    <button
                      onClick={() => reset({ ...watch(), content: watch("content") })} 
                      className="flex items-center justify-center gap-2 rounded-lg bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                      title="Keep input, clear output"
                    >
                      <RefreshCw size={16} />
                    </button>
                  </div>
                </>
              ) : (
                // EMPTY STATE
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                  <div className="h-16 w-16 mb-4 rounded-2xl bg-gray-50 flex items-center justify-center">
                    <AlignLeft size={32} className="opacity-20 text-gray-900" />
                  </div>
                  <p className="text-sm font-medium text-gray-500">Generated content appears here</p>
                  <p className="text-xs text-gray-400 mt-1">Ready when you are</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}