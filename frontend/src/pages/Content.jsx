import { useEffect, useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Card from "../components/Card";
import {
  FileText,
  Maximize2,
  Minimize2,
  Search,
  PenTool,
  History,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const contentFeatures = [
  {
    id: "rewrite",
    link: "/content/rewrite",
    title: "Rewrite Content",
    description: "Refine grammar and flow while keeping your original meaning.",
    icon: <FileText className="w-6 h-6" />,
    gradient: "from-blue-600 to-cyan-500",
  },
  {
    id: "expand",
    link: "/content/expand",
    title: "Expand Content",
    description: "Add depth and detail to brief notes or short paragraphs.",
    icon: <Maximize2 className="w-6 h-6" />,
    gradient: "from-indigo-600 to-purple-500",
  },
  {
    id: "shorten",
    link: "/content/shorten",
    title: "Shorten Content",
    description: "Summarize long articles into concise, punchy sentences.",
    icon: <Minimize2 className="w-6 h-6" />,
    gradient: "from-orange-500 to-amber-400",
  },
  {
    id: "seo-content",
    link: "/content/seo-content",
    title: "SEO Optimizer",
    description: "Generate meta tags, keywords, and titles for better ranking.",
    icon: <Search className="w-6 h-6" />,
    gradient: "from-cyan-500 to-teal-500",
  },
  {
    id: "generate-article",
    link: "/content/generate-article",
    title: "Article Writer",
    description: "Create full-length, structured articles from a simple topic.",
    icon: <PenTool className="w-6 h-6" />,
    gradient: "from-green-600 to-emerald-500",
    badge: "New",
  },
  {
    id: "history",
    link: "/content/history",
    title: "Output Vault",
    description: "Access and manage all your previously generated text.",
    icon: <History className="w-6 h-6" />,
    gradient: "from-purple-500 to-pink-500",
  },
];

export default function Content() {
  const pageRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Header entrance
      tl.from(".content-badge", {
        y: 20,
        opacity: 0,
        duration: 0.6,
      });

      tl.from(
        ".content-title",
        { y: 30, opacity: 0, duration: 0.8 },
        "-=0.4"
      );

      tl.from(
        ".content-subtitle",
        { y: 20, opacity: 0, duration: 0.6 },
        "-=0.5"
      );

      // Cards stagger
      tl.from(
        ".content-card",
        {
          y: 50,
          opacity: 0,
          duration: 0.7,
          stagger: 0.1,
        },
        "-=0.3"
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  // Footer banner scroll animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".content-footer-banner", {
        scrollTrigger: {
          trigger: ".content-footer-banner",
          start: "top 85%",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-[#060a13] text-white relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] -z-0 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-[150px] -z-0 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-white/40 hover:text-white/70 transition-colors mb-12"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        {/* HEADER */}
        <div className="text-center mb-20 space-y-6">
          <div className="content-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-xs font-bold uppercase tracking-[0.2em]">
            <Sparkles size={14} /> AI Writing Assistant
          </div>

          <h1 className="content-title text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
            Content <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">
              Engine
            </span>
          </h1>

          <p className="content-subtitle text-white/40 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            Refine, expand, and generate high-performance copy using our suite of{" "}
            <span className="text-white/70">advanced neural models</span>.
          </p>
        </div>

        {/* CARD GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contentFeatures.map((feature) => (
            <div key={feature.id} className="content-card">
              <Card feature={feature} />
            </div>
          ))}
        </div>

        {/* FOOTER BANNER */}
        <div className="content-footer-banner mt-24 relative overflow-hidden rounded-[2rem] bg-white/5 backdrop-blur-sm border border-white/10 p-8 md:p-12">
          <div className="absolute top-0 right-0 -m-12 opacity-5">
            <FileText size={300} />
          </div>

          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4 text-white">
                Precision Editing. <br /> Infinite Possibilities.
              </h2>
              <p className="text-white/40 text-base leading-relaxed">
                Our content tools don't just replace words; they understand
                context, intent, and tone to ensure your voice remains authentic
                while becoming more professional.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Grammar Check", color: "bg-blue-500" },
                { label: "Plagiarism Safe", color: "bg-purple-500" },
                { label: "Tone Control", color: "bg-orange-500" },
                { label: "Instant Export", color: "bg-green-500" },
              ].map((tag, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 p-4 rounded-xl"
                >
                  <div className={`w-2 h-2 rounded-full ${tag.color}`} />
                  <span className="text-sm font-medium text-white/70">
                    {tag.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
