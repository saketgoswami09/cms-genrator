import React, { useState, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { FileText, Search, BrainCircuit, CheckCircle } from "lucide-react";

const ScanningLoader = () => {
  const containerRef = useRef(null);
  const beamRef = useRef(null);
  const textRef = useRef(null);
  const [loadingText, setLoadingText] = useState("Initializing Scanner...");

  // Analysis Stages for the text animation
  const stages = [
    "Reading PDF Structure...",
    "Extracting Keywords...",
    "Analyzing Impact Metrics...",
    "Comparing against Job Description...",
    "Calculating ATS Score..."
  ];

  useGSAP(() => {
    // 1. The Scanning Beam Animation (Infinite Loop)
    gsap.to(beamRef.current, {
      top: "100%",
      duration: 2,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true, // Goes down then up
    });

    // 2. Text Cycling Logic
    let stageIndex = 0;
    const interval = setInterval(() => {
      stageIndex = (stageIndex + 1) % stages.length;
      
      // Fade out, change text, fade in
      gsap.to(textRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.3,
        onComplete: () => {
          setLoadingText(stages[stageIndex]);
          gsap.to(textRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.3
          });
        }
      });
    }, 1500); // Change text every 1.5 seconds

    return () => clearInterval(interval); // Cleanup
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center py-20">
      
      {/* 📄 DOCUMENT CONTAINER */}
      <div className="relative w-64 h-80 rounded-3xl bg-white/40 border border-white/50 backdrop-blur-xl shadow-2xl overflow-hidden flex items-center justify-center mb-8">
        
        {/* Static Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:16px_16px]"></div>

        {/* Central Icon */}
        <div className="relative z-10 text-gray-300">
           <FileText size={80} strokeWidth={1} />
        </div>

        {/* 🔦 THE SCANNING BEAM */}
        <div 
          ref={beamRef} 
          className="absolute top-0 left-0 w-full h-2 bg-purple-500 shadow-[0_0_40px_5px_rgba(168,85,247,0.6)] z-20"
        >
           {/* Gradient trail behind the beam */}
           <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-purple-500/20 to-transparent"></div>
        </div>

      </div>

      {/* 🧠 DYNAMIC TEXT */}
      <div className="flex items-center gap-3">
        <BrainCircuit className="text-purple-600 animate-pulse" size={20} />
        <h3 
          ref={textRef} 
          className="text-lg font-bold text-gray-700 tracking-wide w-64 text-center"
        >
          {loadingText}
        </h3>
      </div>
      
      <p className="text-xs text-gray-400 mt-2 font-medium">Powered by Creatdiv</p>
    </div>
  );
};

export default ScanningLoader;