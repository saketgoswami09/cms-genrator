import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { Star, Sparkles } from "lucide-react";
import AnimatedGradient from "../ui/AnimatedGradient";

const AuthHero = () => {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // 1. Staggered Text Entrance
      tl.from(".hero-text", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.2,
      });

      // 2. Glass Card Pop-in
      tl.from(".glass-card", {
        y: 60,
        opacity: 0,
        scale: 0.9,
        duration: 1.2,
        ease: "power3.out",
      }, "-=0.8");

      // 3. Continuous Float Animation
      gsap.to(".glass-card", {
        y: "-=15",
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    // Outer container: Dark background, curved corners
    <div ref={containerRef} className="relative hidden lg:flex w-1/2 overflow-hidden bg-[#050505] h-full rounded-[40px] m-4 ring-1 ring-white/10">
      
      {/* 🌌 Background Gradient */}
      <AnimatedGradient />

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 h-full w-full">
        
        {/* Main Text */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-blue-300 mb-6 hero-text">
             <Sparkles size={12} /> AI-Powered V2.0
          </div>
          <h1 className="hero-text text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
            Build faster. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Launch smarter.
            </span>
          </h1>
          <p className="hero-text text-lg text-white/50 max-w-md leading-relaxed">
             The all-in-one platform for creators. Generate visuals, rewrite content, and ship products at lightspeed.
          </p>
        </div>

        {/* 💎 Dark Glass Card */}
        <div className="glass-card relative max-w-md p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
           <div className="flex gap-1 mb-4">
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={16} className="fill-yellow-500 text-yellow-500" />
              ))}
           </div>
           <p className="text-white/80 text-sm font-medium leading-relaxed mb-4">
             "I switched to Dark Mode and never looked back. The AI generation tools are incredibly fast and the UI is stunning."
           </p>
           <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 ring-2 ring-black"></div>
              <div>
                 <p className="text-white text-sm font-bold">Marcus Chen</p>
                 <p className="text-white/40 text-xs">Senior Developer</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default AuthHero;