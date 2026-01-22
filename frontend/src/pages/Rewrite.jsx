import React, { useState, useLayoutEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import gsap from "gsap";

const schema = z.object({
  content: z.string().min(1, "Content is required"),
});

export default function Rewrite() {
  const [rewrittenText, setRewrittenText] = useState(null);
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
  } = useForm({
    resolver: zodResolver(schema),
  });

  const formhandler = async (data) => {
    setIsSubmitting(true);
    setError(null);
    setRewrittenText(null);

    try {
      const res = await rewriteContent(data); // 🔥 TEXT API
      setRewrittenText(res?.data?.result);
    } catch (err) {
      console.error("Rewrite failed", err);
      setError("Failed to rewrite content. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRewriteAgain = () => {
    setRewrittenText(null);
    setError(null);
    reset();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rewrittenText);
      alert("Copied to clipboard!");
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-gray-50 px-4 py-10">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-gray-900">
          Rewrite Content
        </h1>
        <p className="mt-3 text-gray-500">
          Improve, rewrite, and refine your content using AI
        </p>
      </div>

      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT — INPUT */}
        <div className="rounded-2xl bg-white p-6 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.15)]">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">
            Your content
          </h2>

          <form onSubmit={handleSubmit(formhandler)} className="space-y-6">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Content
              </label>
              <textarea
                {...register("content")}
                rows={10}
                placeholder="Paste your content here to rewrite..."
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm resize-none outline-none transition focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900/20"
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.content.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || rewrittenText}
              className="w-full rounded-xl bg-gray-900 text-white py-3 text-sm font-medium transition hover:bg-gray-800 disabled:opacity-60"
            >
              {isSubmitting ? "Rewriting…" : "Rewrite"}
            </button>
          </form>

          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
        </div>

        {/* RIGHT — RESULT */}
        <div className="rounded-2xl bg-white p-6 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.15)]">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">
            Result
          </h2>

          {rewrittenText ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-800 whitespace-pre-wrap">
                {rewrittenText}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCopy}
                  className="flex-1 rounded-xl border border-gray-300 py-2 text-sm font-medium hover:bg-gray-50"
                >
                  Copy
                </button>

                <button
                  onClick={handleRewriteAgain}
                  className="flex-1 rounded-xl bg-gray-900 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Rewrite again
                </button>
              </div>
            </div>
          ) : (
            <div className="flex h-[360px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 text-gray-400">
              <span className="text-sm">Rewritten content will appear here</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
