import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import HeroVideo from "../assets/Need_2_1080P.mp4"; // 👈 your edited video

export default function Home() {
  const heroRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Hero container entrance
      gsap.from(heroRef.current, {
        opacity: 0,
        scale: 0.98,
        duration: 0.8,
        ease: "power3.out",
      });

      // Hero text entrance
      gsap.from(".hero-text", {
        opacity: 0,
        y: 8,
        stagger: 0.12,
        duration: 0.6,
        ease: "power3.out",
        delay: 0.2,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative mx-auto mt-6 max-w-7xl overflow-hidden rounded-3xl"
    >
      {/* Background VIDEO */}
      <video
        className="absolute inset-0 h-[60vh] w-full object-cover"
        src={HeroVideo}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      />

      {/* Soft overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex h-[60vh] items-center justify-center">
        <div className="text-center text-white px-6">
          <h1 className="hero-text text-5xl md:text-7xl font-semibold tracking-tight">
            Creatdiv
          </h1>

          <p className="hero-text mt-4 max-w-xl mx-auto text-white/80">
            A powerful text-to-image model built for creativity.
          </p>

          <div className="hero-text mt-8 flex justify-center gap-3">
            <button className="rounded-full bg-white px-6 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 transition">
              Try it now
            </button>

            <button className="rounded-full bg-white/10 px-6 py-2 text-sm font-medium text-white hover:bg-white/20 transition">
              View examples
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
