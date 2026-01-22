import React, { useState, useLayoutEffect, useRef } from "react";
import { IMAGE_RESOLUTION } from "../constant";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import gsap from "gsap";
import { generateImage } from "../../services/image";

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
  } = useForm({
    resolver: zodResolver(schema),
  });

  const formhandler = async (data) => {
    setIsSubmitting(true);
    setError(null);
    setGeneratedImages(null);

    try {
      const res = await generateImage(data);
      setGeneratedImages(res?.data?.image?.image_url);
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
    reset();
  };
  const handleDownload = async () => {
    try {
      const response = await fetch(generatedImages);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "generated-image.png"; // 👈 filename
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-gray-50 px-4 py-10"
    >
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-gray-900">
          Generate Image
        </h1>
        <p className="mt-3 text-gray-500">
          Create high-quality images using AI prompts
        </p>
      </div>

      {/* Main Grid */}
      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT — PROMPT PANEL */}
        <div className="rounded-2xl bg-white p-6 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.15)]">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">
            Prompt settings
          </h2>

          <form onSubmit={handleSubmit(formhandler)} className="space-y-6">
            {/* Resolution */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Resolution
              </label>
              <select
                {...register("resolution")}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm
                focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none"
              >
                {IMAGE_RESOLUTION.map((resolution) => (
                  <option key={resolution.value} value={resolution.value}>
                    {resolution.label}
                  </option>
                ))}
              </select>
              {errors.resolution && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.resolution.message}
                </p>
              )}
            </div>

            {/* Prompt */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Prompt
              </label>
              <textarea
                {...register("prompt")}
                rows={8}
                placeholder="A cinematic portrait of a futuristic city at sunset…"
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm resize-none outline-none transition focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900/20"
              />
              {errors.prompt && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.prompt.message}
                </p>
              )}
            </div>

            {/* Generate Button */}
            <button
              type="submit"
              disabled={isSubmitting || generatedImages}
              className="w-full rounded-xl bg-gray-900 text-white py-3 text-sm font-medium shadow-sm transition-all duration-200 hover:bg-gray-800 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Generating…
                </>
              ) : (
                "Generate image"
              )}
            </button>
          </form>

          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
        </div>

        {/* RIGHT — RESULT PANEL */}
        <div className="rounded-2xl bg-white p-6 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.15)]">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">
            Result
          </h2>

          {generatedImages ? (
            <div className="space-y-4">
              <img
                src={generatedImages}
                alt="Generated"
                className="w-full rounded-xl"
              />

              <div className="flex gap-3">
                {/* Download */}
                <button
                  onClick={handleDownload}
                  className="flex-1 text-center rounded-xl border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Download
                </button>


                {/* Generate New */}
                <button
                  onClick={handleGenerateNew}
                  className="flex-1 rounded-xl bg-gray-900 py-2 text-sm font-medium text-white hover:bg-gray-800 transition"
                >
                  Generate new image
                </button>
              </div>
            </div>
          ) : (
            <div className="flex h-[360px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 text-gray-400">
              <span className="text-sm">Your image will appear here</span>
              <span className="text-xs mt-1">
                Generated results are shown instantly
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
