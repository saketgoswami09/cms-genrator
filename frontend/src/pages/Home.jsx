import React, { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Play,
  Sparkles,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import HeroVideo from "../assets/vid2.mp4";
import DemoVideo from "../assets/Need_2_1080P.mp4"; // Reuse for demo
import Nav from "../components/nav/Nav";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef(null);
  const videoWrapperRef = useRef(null);
  const videoElRef = useRef(null);
  const loaderRef = useRef(null);

  const [progress, setProgress] = useState(0);

  useLayoutEffect(() => {
    // 🎥 Slow video playback for cinematic feel
    if (videoElRef.current) videoElRef.current.playbackRate = 0.9;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // =========================================
      // 1. OPENING SEQUENCE (Loader -> Hero)
      // =========================================
      tl.to(
        {},
        {
          duration: 1.5,
          onUpdate() {
            setProgress(Math.round(this.progress() * 100));
          },
        },
      )
        .to(loaderRef.current, {
          yPercent: -100,
          duration: 1,
          ease: "power4.inOut",
        })
        .from(
          ".hero-frame",
          { scale: 0.9, duration: 1.2, ease: "power3.out" },
          "-=0.6",
        )
        .from(
          ".title-word",
          { yPercent: 100, duration: 1, stagger: 0.1, ease: "power3.out" },
          "-=0.8",
        )
        .from(
          ".hero-fade",
          {
            opacity: 0,
            y: 30,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
          },
          "-=0.5",
        );

      // =========================================
      // 2. SCROLL INTERACTIONS
      // =========================================

      // A. Parallax Hero Video
      gsap.to(videoWrapperRef.current, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-frame",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // B. "How it Works" Video Expand
      gsap.from(".demo-video-container", {
        scale: 0.5,
        borderRadius: "60px",
        scrollTrigger: {
          trigger: ".demo-section",
          start: "top bottom",
          end: "center center",
          scrub: 1, // Smooth scrub
        },
      });

      // C. Floating UI Overlay (Constant Motion)
      gsap.to(".floating-ui", {
        y: -15,
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });

      // D. Rewrite Section: "Bad" to "Good" Transformation
      const rewriteTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".rewrite-section",
          start: "top 60%", // Start when section is near center
        },
      });

      rewriteTl
        .from(".rewrite-card-bad", {
          x: -50,
          opacity: 0,
          duration: 0.6,
          ease: "back.out",
        })
        .from(
          ".rewrite-arrow",
          { scale: 0, rotation: -180, duration: 0.4 },
          "-=0.2",
        )
        .from(
          ".rewrite-card-good",
          { x: 50, opacity: 0, duration: 0.6, ease: "back.out" },
          "-=0.2",
        )
        .from(".rewrite-badge", {
          scale: 0,
          duration: 0.4,
          ease: "elastic.out(1, 0.5)",
        });

      // E. Gallery Stagger
      gsap.from(".gallery-item", {
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".gallery-grid",
          start: "top 80%",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-white p-4 md:p-6 lg:p-8 font-sans overflow-x-hidden"
    >
      {/* --- PRELOADER --- */}
      <div
        ref={loaderRef}
        className="fixed inset-0 z-50 flex items-end justify-between bg-[#0a0a0a] px-6 py-8 text-white md:px-12"
      >
        <div className="text-sm uppercase tracking-widest text-white/50">
          Creatdiv AI <br /> Est. 2026
        </div>
        <div className="text-9xl font-bold leading-none tracking-tighter opacity-20 text-white">
          {progress}%
        </div>
      </div>

      {/* --- HERO SECTION --- */}
      <section className="hero-frame relative h-[85vh] w-full overflow-hidden rounded-[32px] md:rounded-[48px] shadow-sm mb-24 bg-black">
        <div
          ref={videoWrapperRef}
          className="absolute inset-0 -top-[10%] h-[120%] w-full"
        >
          <video
            ref={videoElRef}
            src={HeroVideo}
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover opacity-80"
          />
        </div>

        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
          <div className="hero-fade mb-8 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur-md border border-white/10">
            ✨ Next Gen Generation
          </div>
          <div className="overflow-hidden">
            <h1 className="title-word text-[12vw] md:text-[8rem] font-semibold leading-[0.9] tracking-tighter text-white">
              Creatdiv
            </h1>
          </div>
          <div className="overflow-hidden">
            <h1 className="title-word text-[12vw] md:text-[8rem] font-semibold leading-[0.9] tracking-tighter text-white">
              Visuals
            </h1>
          </div>

          <div className="hero-fade mt-10 flex flex-col sm:flex-row gap-4">
            <Link to="/image/generate">
              <button className="group flex items-center gap-2 rounded-full bg-white px-8 py-4 text-black font-semibold hover:scale-105 transition active:scale-95">
                Try it now{" "}
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition"
                />
              </button>
            </Link>
          </div>
        </div>

        <Nav />
      </section>

      {/* --- DEMO VIDEO SECTION (Floating UI Animation) --- */}
      <section className="demo-section relative py-20">
        <div className="text-center mb-16 px-4">
          <span className="text-purple-600 font-bold uppercase tracking-wider text-xs mb-3 block">
            Workflow
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight leading-tight">
            Turn words into <br /> worlds instantly.
          </h2>
        </div>

        <div className="demo-video-container mx-auto w-full max-w-[90vw] h-[60vh] md:h-[80vh] overflow-hidden shadow-2xl relative rounded-[32px] bg-black">
          <video
            src={DemoVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-90"
          />

          {/* 🔥 Floating UI Overlay */}
          <div className="floating-ui absolute bottom-12 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 flex items-center gap-4 shadow-2xl">
            <div className="h-12 w-12 rounded-full bg-linear-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white shrink-0 shadow-lg">
              <Sparkles size={20} className="animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="h-2.5 w-24 bg-white/40 rounded-full mb-2"></div>
              <p className="text-white text-sm font-medium truncate">
                "A futuristic city with flying cars at sunset..."
              </p>
            </div>
            <div className="px-3 py-1.5 bg-white/90 text-black text-[10px] font-bold rounded-lg uppercase tracking-wider shadow-sm">
              Generating
            </div>
          </div>
        </div>
      </section>
      {/* --- GALLERY SECTION (Scroll Stagger) --- */}
      <section className="py-24 px-4 max-w-[90vw] mx-auto">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
            Made with Creatdiv
          </h2>
          <span className="hidden md:block text-sm font-medium text-gray-400">
            Scroll to explore
          </span>
        </div>

        <div className="gallery-grid grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <GalleryItem
            src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80"
            title="Neon Cyberpunk"
          />
          <GalleryItem
            src="https://images.unsplash.com/photo-1768980916747-fd6dc938f8e0?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            title="Abstract Fluid"
          />
          <GalleryItem
            src="https://images.unsplash.com/photo-1768924401996-4c8d79462660?q=80&w=1102&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            title="people in a dimly lit art gallery"
          />
          <GalleryItem
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80"
            title="Glass Prism"
          />
        </div>
      </section>

      
          {/* --- REWRITE SECTION (Storytelling Animation) --- */}
      <section className="rewrite-section py-32 bg-[#F8F9FA] my-12 rounded-[48px] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          {/* Text Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mb-6">
              <Sparkles size={12} /> Rewrite V2
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-[1.1]">
              Refine your text <br /> with precision.
            </h2>
            <p className="text-lg text-gray-500 mb-8 leading-relaxed max-w-md">
              Transform your content instantly. Fix grammar, change tone, and
              expand ideas without losing your voice.
            </p>
            <button className="group flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 transition-colors">
              Try Rewriting{" "}
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>

          {/* 🔥 Animated Cards */}
          <div className="relative perspective-1000">
            {/* Background Glow */}
            <div className="absolute -inset-10 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl opacity-50"></div>

            <div className="relative flex flex-col gap-6">
              {/* BAD Card */}
              <div className="rewrite-card-bad relative bg-white p-6 rounded-2xl shadow-sm border border-red-100 flex gap-4 items-start opacity-50">
                <XCircle className="text-red-400 shrink-0" size={24} />
                <div>
                  <p className="text-gray-400 text-sm line-through decoration-red-300">
                    "hey can u check this its bad."
                  </p>
                </div>
              </div>

              {/* Arrow */}
              <div className="rewrite-arrow flex justify-center py-2">
                <div className="bg-white p-2 rounded-full shadow-sm border border-gray-100 text-gray-400">
                  <ArrowRight className="rotate-90" size={20} />
                </div>
              </div>

              {/* GOOD Card */}
              <div className="rewrite-card-good relative bg-white p-6 rounded-2xl shadow-xl border border-blue-100 flex gap-4 items-start scale-105">
                <CheckCircle2 className="text-blue-500 shrink-0" size={24} />
                <div>
                  <p className="text-gray-900 font-medium text-lg leading-snug">
                    "Could you please review this draft? I believe it requires
                    improvement."
                  </p>
                  <div className="rewrite-badge mt-3 inline-block px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded">
                    Professional Tone
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </section>
      <div className="h-20 flex items-center justify-center text-gray-300 text-sm">
        © 2026 Creatdiv Inc.
      </div>
    </div>
  );
}

// Simple Helper for Gallery Items
const GalleryItem = ({ src, title }) => (
  <div className="gallery-item group relative overflow-hidden rounded-2xl aspect-[3/4] cursor-pointer">
    <img
      src={src}
      alt={title}
      className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
      <span className="text-white font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
        {title}
      </span>
    </div>
  </div>
);
