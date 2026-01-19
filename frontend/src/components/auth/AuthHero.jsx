import React from "react";
import AnimatedGradient from "../ui/AnimatedGradient";

const AuthHero = () => {
  return (
    // 'right-panel' class is used by the GSAP hook
    <div className="right-panel relative hidden lg:flex overflow-hidden h-full">
      {/* Canvas gradient */}
      <AnimatedGradient />

      {/* Overlay content */}
      <div className="relative z-10 flex flex-col justify-center px-16 text-white h-full">
        {/* 'right-text' class is used by the GSAP hook */}
        <h1 className="right-text text-4xl font-semibold tracking-tight">
          Build faster. <br /> Launch smarter.
        </h1>
        
        <p className="right-text mt-4 max-w-md text-white/70">
          Join creators and teams using our platform to design, build and ship
          high-quality products.
        </p>
      </div>

      {/* Dark overlay for contrast */}
      <div className="pointer-events-none absolute inset-0 bg-black/30" />
    </div>
  );
};

export default AuthHero;