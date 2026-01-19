import React from "react";
import video from "../../assets/VID.mp4"
const AuthHeroVideo = () => {
  return (
    <div className="relative hidden lg:flex overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={video}      // 👈 your product demo
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Soft gradient vignette (premium touch) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

      {/* Optional subtle copy */}
      <div className="relative z-10 flex flex-col justify-end p-16 text-white">
        <p className="max-w-sm text-sm text-white/70">
          Experience how teams build, collaborate, and ship faster.
        </p>
      </div>
    </div>
  );
};

export default AuthHeroVideo;
