import React, { useState,useLayoutEffect, useRef } from "react";
import { IMAGE_RESOLUTIONS } from "../constant";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import gsap from "gsap";
import {generateImage} from '../../services/image'

const schema = z.object({
  resolution: z.string().min(1, "Resolution is required"),
  prompt: z.string().min(1, "Prompt is required"),
});

export default function GenerateImage() {
  const [generatedImages, setGeneratedImages] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pageRef = useRef(null);
  const [error, setError] = useState(null);

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
  } = useForm({
    resolver: zodResolver(schema),
  });

  const formhandler = async (data) => {
    console.log(data);
      // setGeneratedImages("image-url-here");
    setIsSubmitting(true);
    setError(null);
    setGeneratedImages(null);
    try {
      const res = await generateImage(data);
      setGeneratedImages(res?.data?.image);
      
    } catch (error) {
      console.log("error in generating image",error);
      
      setError("Failed to generate image. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ RETURN IS INSIDE THE FUNCTION
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10" ref={pageRef} >
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
                {IMAGE_RESOLUTIONS.map((resolution) => (
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
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm
                resize-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none"
              />
              {errors.prompt && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.prompt.message}
                </p>
              )}
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r
              from-[hsl(220,75%,60%)] via-[hsl(260,75%,60%)] to-[hsl(310,70%,65%)]
              py-3 text-sm font-medium text-white shadow-lg shadow-purple-500/30
              hover:brightness-110 active:scale-[0.97] transition-all"
              onClick={()=>{}}
            >
              Generate image
            </button>
            
          </form>
          {error && <p className='mt-1 text-sm text-red-500'>{error}</p>}
        </div>

        {/* RIGHT — RESULT PANEL */}
        <div className="rounded-2xl bg-white p-6 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.15)]">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">Result</h2>

          {generatedImages ? (
            <img src={generatedImages} alt="Generated" />
          ) : (
            <div className="flex h-[320px] items-center justify-center rounded-xl border border-dashed text-gray-400">
              No image generated yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
