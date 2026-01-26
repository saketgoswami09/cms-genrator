import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Nav from "../nav/Nav";

const Hero = ({ videoWrapperRef, videoElRef, videoSrc }) => (
  <section className="hero-frame relative h-[85vh] w-full overflow-hidden rounded-[32px] md:rounded-[48px] shadow-sm mb-24 bg-black">
    <div ref={videoWrapperRef} className="absolute inset-0 -top-[10%] h-[120%] w-full">
      <video
        ref={videoElRef}
        src={videoSrc}
        autoPlay loop muted playsInline
        className="h-full w-full object-cover opacity-80"
      />
    </div>

    <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
      <div className="hero-fade mb-8 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur-md border border-white/10">
        ✨ Next Gen Generation
      </div>
      {["Creatdiv", "Visuals"].map((word, i) => (
        <div key={i} className="overflow-hidden">
          <h1 className="title-word text-[12vw] md:text-[8rem] font-semibold leading-[0.9] tracking-tighter text-white">
            {word}
          </h1>
        </div>
      ))}

      <div className="hero-fade mt-10">
        <Link to="/image/generate">
          <button className="group flex items-center gap-2 rounded-full bg-white px-8 py-4 text-black font-semibold hover:scale-105 transition active:scale-95">
            Try it now <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
          </button>
        </Link>
      </div>
    </div>
    <Nav />
  </section>
);

export default Hero;