import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import gsap from "gsap";
import { toast } from "react-toastify";
import { 
  Wand2, Copy, RefreshCw, Check, Sparkles, FileText, AlignLeft,
  Clipboard, Eraser, History as HistoryIcon 
} from "lucide-react";
import { useParams, Navigate } from "react-router-dom";
import { PAGES } from "../../constants/constant";
import { handleCopy as copyToClipboard } from "../utils/global";

const MAX_CHARS = 2000;
const TONE_OPTIONS = ["Professional", "Casual", "Enthusiastic", "Concise", "Expanded"];

const schema = z.object({
  content: z.string().min(1, "Content is required").max(MAX_CHARS, `Content must be under ${MAX_CHARS} characters`),
  tone: z.string().default("Professional"),
});

export default function GenerateContent() {
  const [generatedContent, setGeneratedContent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  
  const { action } = useParams();
  const pageContent = PAGES[action];

  const pageRef = useRef(null);
  const resultRef = useRef(null);

  // Animation for page entrance
  useLayoutEffect(() => {
    if (!pageContent) return;
    const ctx = gsap.context(() => {
      gsap.from(pageRef.current, { 
        opacity: 0, 
        y: 16, 
        duration: 0.6, 
        ease: "power3.out" 
      });
    });
    return () => ctx.revert();
  }, [action, pageContent]);

  // Animation for AI result appearance
  useEffect(() => {
    if (!generatedContent || !resultRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".result-content", 
        { opacity: 0, y: 10, filter: "blur(5px)" }, 
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.5, ease: "power2.out" }
      );
    }, resultRef);
    
    if (window.innerWidth < 1024) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    return () => ctx.revert();
  }, [generatedContent]);

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { tone: "Professional" }
  });

  const contentValue = watch("content") || "";
  const currentTone = watch("tone");

  if (!pageContent) {
    return <Navigate to="/" replace />;
  }

  const formHandler = async (data) => {
    setIsSubmitting(true);
    setError(null);
    setGeneratedContent(null);

    try {
      const { data: res } = await pageContent.handler(data);
      setGeneratedContent(res?.content);
    } catch (err) {
      const errMsg = "Failed to generate content. Please try again.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setValue("content", text, { shouldValidate: true });
    } catch (err) { 
      toast.error("Clipboard access denied.");
    }
  };

  const handleClear = () => {
    setValue("content", "", { shouldValidate: true });
    setGeneratedContent(null);
  };

  const onCopy = async () => {
    if (!generatedContent) return;
    copyToClipboard(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-[#F9FAFB] px-4 py-12 font-sans relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.4]" 
           style={{ backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* HEADER */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 text-blue-600">
            <Wand2 size={24} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">{pageContent.header}</h1>
          <p className="mt-2 text-lg text-gray-500">{pageContent["sub-header"] || pageContent.subHeader}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* LEFT: INPUT */}
          <div className="flex flex-col h-full rounded-2xl bg-white shadow-xl shadow-gray-200/50 ring-1 ring-gray-100 overflow-hidden transition-shadow hover:shadow-2xl">
            <div className="px-5 py-3 border-b border-gray-100 bg-white flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                <FileText size={14} />
                <span>Input</span>
              </div>
              <div className="flex items-center gap-1">
                <button type="button" onClick={handlePaste} className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-md transition">
                    <Clipboard size={12} /> Paste
                </button>
                {contentValue.length > 0 && (
                    <button type="button" onClick={handleClear} className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition">
                        <Eraser size={12} /> Clear
                    </button>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit(formHandler)} className="flex-1 flex flex-col">
              <div className="flex-1 relative group bg-gray-50/30">
                <textarea
                  {...register("content")}
                  className="w-full h-full min-h-75 p-6 text-gray-800 placeholder:text-gray-400 text-base leading-relaxed resize-none focus:outline-none bg-transparent"
                  placeholder={pageContent["input-placeholder"]}
                />
                <div className={`absolute bottom-4 right-6 text-xs font-medium transition-colors ${contentValue.length > MAX_CHARS ? "text-red-500" : "text-gray-300"}`}>
                    {contentValue.length}/{MAX_CHARS}
                </div>
              </div>

              <div className="px-5 py-4 bg-white border-t border-gray-100">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 block">Select Tone</label>
                <div className="flex flex-wrap gap-2">
                  {TONE_OPTIONS.map((t) => (
                    <label 
                      key={t}
                      className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                        currentTone === t 
                          ? "bg-gray-900 text-white border-gray-900 shadow-md transform scale-105" 
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <input type="radio" value={t} {...register("tone")} className="hidden" />
                      {t}
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="p-5 bg-white border-t border-gray-100">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full relative flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="animate-spin" size={18} />
                      <span>{pageContent["loading-text"]}</span>
                    </>
                  ) : (
                    <>
                      <span>{pageContent["button-content"]}</span>
                      <Wand2 size={16} />
                    </>
                  )}
                </button>
                {errors.content && <p className="mt-2 text-center text-xs text-red-500">{errors.content.message}</p>}
              </div>
            </form>
          </div>

          {/* RIGHT: RESULT */}
          <div className="h-full flex flex-col">
            <div ref={resultRef} className={`flex-1 flex flex-col rounded-2xl bg-white shadow-xl shadow-gray-200/50 ring-1 ring-gray-100 overflow-hidden transition-all duration-500 ${generatedContent ? 'ring-2 ring-purple-500/20' : ''}`}>
               <div className="px-5 py-3 border-b border-gray-100 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-2 text-purple-600 text-xs font-semibold uppercase tracking-wider">
                     <Sparkles size={14} />
                     <span>AI Output</span>
                  </div>
                  {generatedContent && (
                      <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded">
                        {currentTone}
                      </span>
                  )}
               </div>

               <div className="p-6 flex-1 flex flex-col min-h-100 bg-gray-50/30">
                  {isSubmitting ? (
                    <div className="space-y-4 animate-pulse pt-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </div>
                  ) : generatedContent ? (
                    <>
                        <div className="result-content flex-1 text-base leading-relaxed text-gray-800 whitespace-pre-wrap font-mono">
                            {generatedContent}
                        </div>
                        <div className="result-actions mt-8 flex gap-3 pt-4 border-t border-gray-200/60">
                            <button onClick={onCopy} className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
                                {copied ? <Check size={16} className="text-green-600"/> : <Copy size={16} />}
                                {copied ? "Copied" : "Copy"}
                            </button>
                            <button onClick={() => { setGeneratedContent(null); reset(); }} className="px-4 py-2.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm" title="Clear Output">
                                <RefreshCw size={16} />
                            </button>
                        </div>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
                        <AlignLeft size={48} className="opacity-20 mb-4" />
                        <p className="text-sm font-medium text-gray-400">{pageContent["output-subheader"]}</p>
                        <p className="text-xs mt-1 text-gray-400 opacity-70 px-6 text-center">{pageContent["output-form-action"]}</p>
                    </div>
                  )}
               </div>
            </div>
          </div>
        </div>

        {/* FOOTER & HISTORY DIVIDER */}
        <div className="relative py-12">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
          <div className="relative flex justify-center">
            <span className="bg-[#F9FAFB] px-4 text-sm text-gray-400 flex items-center gap-2">
              <HistoryIcon size={16} /> Recent Activity
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}