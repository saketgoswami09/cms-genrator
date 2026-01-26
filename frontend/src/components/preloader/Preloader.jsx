import React from "react";

const Preloader = ({ progress, loaderRef }) => (
  <div
    ref={loaderRef}
    className="fixed inset-0 z-100 flex items-end justify-between bg-[#0a0a0a] px-6 py-8 text-white md:px-12"
  >
    <div className="text-sm uppercase tracking-widest text-white/50">
      Creatdiv AI <br /> Est. 2026
    </div>
    <div className="text-9xl font-bold leading-none tracking-tighter opacity-20 text-white">
      {progress}%
    </div>
  </div>
);

export default Preloader;