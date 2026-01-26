import React, { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import HeroVideo from "../assets/vid2.mp4";
import DemoVideo from "../assets/Need_2_1080P.mp4";

import Preloader from "../components/preloader/Preloader";
import Hero from "../components/home/Hero";
import WorkflowDemo from "../components/home/WorkFlowDemo";
import RewriteSection from "../components/home/RewriteSection";
import GalleryItem from "../components/home/GalleryItem";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef(null);
  const videoWrapperRef = useRef(null);
  const videoElRef = useRef(null);
  const loaderRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useLayoutEffect(() => {
    if (videoElRef.current) videoElRef.current.playbackRate = 0.9;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Opening Sequence
      tl.to({}, { duration: 1.5, onUpdate() { setProgress(Math.round(this.progress() * 100)); }})
        .to(loaderRef.current, { yPercent: -100, duration: 1, ease: "power4.inOut" })
        .from(".hero-frame", { scale: 0.9, duration: 1.2, ease: "power3.out" }, "-=0.6")
        .from(".title-word", { yPercent: 100, duration: 1, stagger: 0.1, ease: "power3.out" }, "-=0.8")
        .from(".hero-fade", { opacity: 0, y: 30, duration: 0.8, stagger: 0.1, ease: "power2.out" }, "-=0.5");

      // Scroll Interactions
      gsap.to(videoWrapperRef.current, {
        yPercent: 20, ease: "none",
        scrollTrigger: { trigger: ".hero-frame", start: "top top", end: "bottom top", scrub: true }
      });

      gsap.from(".demo-video-container", {
        scale: 0.5, borderRadius: "60px",
        scrollTrigger: { trigger: ".demo-section", start: "top bottom", end: "center center", scrub: 1 }
      });

      gsap.to(".floating-ui", { y: -15, duration: 2, yoyo: true, repeat: -1, ease: "sine.inOut" });

      const rewriteTl = gsap.timeline({
        scrollTrigger: { trigger: ".rewrite-section", start: "top 60%" }
      });

      rewriteTl.from(".rewrite-card-bad", { x: -50, opacity: 0, duration: 0.6, ease: "back.out" })
               .from(".rewrite-arrow", { scale: 0, rotation: -180, duration: 0.4 }, "-=0.2")
               .from(".rewrite-card-good", { x: 50, opacity: 0, duration: 0.6, ease: "back.out" }, "-=0.2")
               .from(".rewrite-badge", { scale: 0, duration: 0.4, ease: "elastic.out(1, 0.5)" });

      gsap.from(".gallery-item", {
        y: 100, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: ".gallery-grid", start: "top 80%" }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-white p-4 md:p-8 font-sans overflow-x-hidden">
      <Preloader progress={progress} loaderRef={loaderRef} />
      
      <Hero 
        videoWrapperRef={videoWrapperRef} 
        videoElRef={videoElRef} 
        videoSrc={HeroVideo} 
      />

      <WorkflowDemo videoSrc={DemoVideo} />

      <section className="py-24 px-4 max-w-[90vw] mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-12">Made with Creatdiv</h2>
        <div className="gallery-grid grid grid-cols-2 md:grid-cols-4 gap-6">
          <GalleryItem src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800" title="Neon Cyberpunk" />
          <GalleryItem src="https://images.unsplash.com/photo-1768980916747-fd6dc938f8e0?w=800" title="Abstract Fluid" />
          <GalleryItem src="https://images.unsplash.com/photo-1768924401996-4c8d79462660?w=800" title="Art Gallery" />
          <GalleryItem src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800" title="Glass Prism" />
        </div>
      </section>

      <RewriteSection />

      <footer className="h-20 flex items-center justify-center text-gray-300 text-sm">
        © 2026 Creatdiv Inc.
      </footer>
    </div>
  );
}