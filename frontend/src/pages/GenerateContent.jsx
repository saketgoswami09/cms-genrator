import { useState, useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import gsap from "gsap";
import { toast } from "react-toastify";
import {
  Wand2, Copy, Check, Sparkles, FileText, AlignLeft,
  Clipboard, Eraser, History as HistoryIcon,
} from "lucide-react";
import { useParams, Navigate } from "react-router-dom";

import { PAGES } from "@/constants/content-pages";
import { handleCopy as copyToClipboard } from "@/utils/global";
import { usePageEntrance } from "@/hooks/usePageEntrance";
import PageShell from "@/components/ui/PageShell";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import SectionDivider from "@/components/ui/SectionDivider";

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

  const { action } = useParams();
  const pageContent = PAGES[action];

  const pageRef = useRef(null);
  const resultRef = useRef(null);

  usePageEntrance(pageRef, [action]);

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
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    return () => ctx.revert();
  }, [generatedContent]);

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { tone: "Professional" },
  });

  const contentValue = watch("content") || "";
  const currentTone = watch("tone");

  if (!pageContent) {
    return <Navigate to="/" replace />;
  }

  const formHandler = async (data) => {
    setIsSubmitting(true);
    setGeneratedContent(null);

    try {
      const { data: res } = await pageContent.handler(data);
      setGeneratedContent(res?.content);
    } catch {
      const errMsg = "Failed to generate content. Please try again.";
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setValue("content", text, { shouldValidate: true });
    } catch {
      toast.error("Clipboard access denied.");
    }
  };

  const handleClear = () => {
    setValue("content", "", { shouldValidate: true });
    setGeneratedContent(null);
  };

  const onCopy = () => {
    if (!generatedContent) return;
    copyToClipboard(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageShell>
      <div ref={pageRef} className="px-4 py-12 mx-auto max-w-6xl">
        {/* HEADER */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-white/10 ring-1 ring-white/10 text-blue-400">
            <Wand2 size={24} />
          </div>
          <h1 className="text-4xl font-heading tracking-tight text-white">{pageContent.header}</h1>
          <p className="mt-2 text-lg text-white/40">{pageContent.subHeader}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* LEFT: INPUT */}
          <GlassCard className="flex flex-col h-full hover:ring-white/20">
            <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white/50 text-xs font-semibold uppercase tracking-wider">
                <FileText size={14} />
                <span>Input</span>
              </div>
              <div className="flex items-center gap-1">
                <button type="button" onClick={handlePaste} className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-white/60 bg-white/10 hover:bg-white/15 rounded-md transition">
                  <Clipboard size={12} /> Paste
                </button>
                {contentValue.length > 0 && (
                  <button type="button" onClick={handleClear} className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-md transition">
                    <Eraser size={12} /> Clear
                  </button>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit(formHandler)} className="flex-1 flex flex-col">
              <div className="flex-1 relative group bg-white/[0.02]">
                <textarea
                  {...register("content")}
                  className="w-full h-full min-h-75 p-6 text-white placeholder:text-white/30 text-base leading-relaxed resize-none focus:outline-none bg-transparent"
                  placeholder={pageContent.inputPlaceholder}
                />
                <div className={`absolute bottom-4 right-6 text-xs font-medium transition-colors ${contentValue.length > MAX_CHARS ? "text-red-400" : "text-white/20"}`}>
                  {contentValue.length}/{MAX_CHARS}
                </div>
              </div>

              <div className="px-5 py-4 border-t border-white/10">
                <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 block">Select Tone</label>
                <div className="flex flex-wrap gap-2">
                  {TONE_OPTIONS.map((t) => (
                    <label
                      key={t}
                      className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                        currentTone === t
                          ? "bg-white text-[#060a13] border-white shadow-md transform scale-105"
                          : "bg-white/5 text-white/60 border-white/10 hover:border-white/20 hover:bg-white/10"
                      }`}
                    >
                      <input type="radio" value={t} {...register("tone")} className="hidden" />
                      {t}
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-5 border-t border-white/10">
                <GradientButton type="submit" loading={isSubmitting} loadingText={pageContent.loadingText}>
                  <span>{pageContent.buttonContent}</span>
                  <Wand2 size={16} />
                </GradientButton>
                {errors.content && <p className="mt-2 text-center text-xs text-red-500">{errors.content.message}</p>}
              </div>
            </form>
          </GlassCard>

          {/* RIGHT: RESULT */}
          <div className="h-full flex flex-col">
            <GlassCard ref={resultRef} active={!!generatedContent} className="flex-1 flex flex-col">
              <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider">
                  <Sparkles size={14} />
                  <span>AI Output</span>
                </div>
                {generatedContent && (
                  <span className="text-xs font-medium text-white/40 bg-white/10 px-2 py-1 rounded">
                    {currentTone}
                  </span>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col min-h-100 bg-white/[0.02]">
                {isSubmitting ? (
                  <div className="space-y-4 animate-pulse pt-2">
                    <div className="h-4 bg-white/10 rounded w-3/4" />
                    <div className="h-4 bg-white/10 rounded w-full" />
                    <div className="h-4 bg-white/10 rounded w-5/6" />
                    <div className="h-4 bg-white/10 rounded w-full" />
                  </div>
                ) : generatedContent ? (
                  <>
                    <div className="result-content flex-1 text-base leading-relaxed text-white/80 whitespace-pre-wrap font-mono">
                      {generatedContent}
                    </div>
                    <div className="result-actions mt-8 flex gap-3 pt-4 border-t border-white/10">
                      <button onClick={onCopy} className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 transition-colors">
                        {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                        {copied ? "Copied" : "Copy"}
                      </button>
                      <button onClick={() => { setGeneratedContent(null); reset(); }} className="px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white transition-colors" title="Clear Output">
                        <Wand2 size={16} />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-white/20">
                    <AlignLeft size={48} className="opacity-20 mb-4" />
                    <p className="text-sm font-medium text-white/30">{pageContent.outputSubheader}</p>
                    <p className="text-xs mt-1 text-white/20 px-6 text-center">{pageContent.outputFormAction}</p>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        </div>

        <SectionDivider icon={HistoryIcon} label="Recent Activity" />
      </div>
    </PageShell>
  );
}
