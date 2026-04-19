import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import Card from "../components/Card";
import {
  Image as ImageIcon,
  History as ListIcon,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

const imageFeature = [
  {
    id: "generate",
    link: "/image/generate",
    title: "Generate Image",
    description:
      "Transform your text prompts into high-quality AI visuals instantly.",
    icon: <ImageIcon className="w-6 h-6" />,
    gradient: "from-purple-600 to-pink-500",
    badge: "Popular",
  },
  {
    id: "history",
    link: "/image/history",
    title: "Image History",
    description:
      "Access your past creations, re-download, or refine your previous work.",
    icon: <ListIcon className="w-6 h-6" />,
    gradient: "from-blue-600 to-cyan-500",
  },
];

export default function Image() {
  const pageRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".img-badge", { y: 20, opacity: 0, duration: 0.6 });
      tl.from(".img-title", { y: 30, opacity: 0, duration: 0.8 }, "-=0.4");
      tl.from(".img-subtitle", { y: 20, opacity: 0, duration: 0.6 }, "-=0.5");

      tl.from(
        ".img-card",
        { y: 50, opacity: 0, duration: 0.7, stagger: 0.15 },
        "-=0.3"
      );

      tl.from(
        ".img-banner",
        { y: 40, opacity: 0, duration: 0.8 },
        "-=0.4"
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-[#060a13] text-white relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-600/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 md:py-24">
        {/* Back */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-white/40 hover:text-white/70 transition-colors mb-12"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        {/* HEADER */}
        <div className="max-w-2xl mb-16">
          <div className="img-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-purple-400 text-xs font-bold uppercase tracking-[0.2em] mb-6">
            <Sparkles size={14} /> AI Visual Suite
          </div>
          <h1 className="img-title text-5xl md:text-7xl font-black tracking-tighter mb-6">
            Image{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Studio
            </span>
          </h1>
          <p className="img-subtitle text-white/40 text-lg leading-relaxed">
            Create stunning visuals from simple text descriptions and manage
            your entire creative gallery in one powerful workspace.
          </p>
        </div>

        {/* CARDS */}
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {imageFeature.map((feature) => (
            <div key={feature.id} className="img-card">
              <Card feature={feature} />
            </div>
          ))}
        </div>

        {/* ABOUT BANNER */}
        <div className="img-banner relative group overflow-hidden rounded-[2rem] bg-white/5 backdrop-blur-sm border border-white/10 p-8 md:p-12 transition-all hover:border-white/20">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <ImageIcon size={120} />
          </div>

          <div className="relative z-10 max-w-3xl">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              Powerful Image Tools at your fingertips
            </h2>
            <p className="text-white/40 leading-relaxed">
              Our studio uses the latest Diffusion models to ensure your images
              are photorealistic and sharp. Whether you are building a website,
              social content, or digital art, the Studio handles the complexity
              so you can focus on the vision.
            </p>
            <div className="mt-8 flex gap-6 text-sm font-semibold text-white/30">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> High
                Resolution
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Fast
                Generation
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}