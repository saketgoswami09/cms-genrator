import React from "react";
import { Sparkles } from "lucide-react";

const WorkflowDemo = ({ videoSrc }) => (
  <section className="demo-section relative py-20">
    <div className="text-center mb-16 px-4">
      <span className="text-purple-600 font-bold uppercase tracking-wider text-xs mb-3 block">Workflow</span>
      <h2 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight leading-tight">
        Turn words into <br /> worlds instantly.
      </h2>
    </div>

    <div className="demo-video-container mx-auto w-full max-w-[90vw] h-[60vh] md:h-[80vh] overflow-hidden shadow-2xl relative rounded-[32px] bg-black">
      <video src={videoSrc} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-90" />
      
      {/* Floating UI */}
      <div className="floating-ui absolute bottom-12 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 flex items-center gap-4 shadow-2xl">
        <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white shrink-0 shadow-lg">
          <Sparkles size={20} className="animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="h-2.5 w-24 bg-white/40 rounded-full mb-2"></div>
          <p className="text-white text-sm font-medium truncate">"A futuristic city with flying cars at sunset..."</p>
        </div>
        <div className="px-3 py-1.5 bg-white/90 text-black text-[10px] font-bold rounded-lg uppercase tracking-wider">Generating</div>
      </div>
    </div>
  </section>
);

export default WorkflowDemo;