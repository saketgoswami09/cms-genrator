import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAuth } from "@/hooks/useAuth";
import {
  ArrowRight,
  ImageIcon,
  FileText,
  BarChart3,
  Sparkles,
  Wand2,
  CheckCircle2,
  XCircle,
  ArrowDown,
} from "lucide-react";
import {
  GeminiIcon,
  HuggingFaceIcon,
  OpenAIIcon,
  MidjourneyIcon,
} from "@/components/ui/AIIcons";

gsap.registerPlugin(ScrollTrigger);

const FloatingBadge = ({ icon, label, color, className = "", rotation = 0 }) => (
  <div
    className={`floating-badge absolute hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-3 py-2 text-white/55 shadow-lg backdrop-blur-xl ring-1 ring-white/[0.03] ${className}`}
    style={{
      transform: `rotate(${rotation}deg)`,
      boxShadow: `0 12px 44px ${color}18`,
    }}
  >
    <div className="flex size-6 items-center justify-center opacity-80" style={{ color }}>
      {icon}
    </div>
    <span className="text-[11px] font-semibold tracking-tight text-white/55">
      {label}
    </span>
  </div>
);

const FeatureCard = ({ icon, title, description, gradient, link, index }) => (
  <Link to={link} className="feature-card group block">
    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-sm p-8 md:p-10 transition-all duration-500 hover:border-white/20 hover:bg-white/10 active:scale-[0.98]">
      {/* Glow */}
      <div
        className={`absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${gradient} opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-30`}
      />

      {/* Number */}
      <div className="text-[80px] font-black leading-none text-white/[0.03] absolute top-4 right-6 select-none pointer-events-none">
        0{index + 1}
      </div>

      <div className="relative z-10">
        <div
          className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} text-white mb-8 shadow-lg`}
        >
          {icon}
        </div>

        <h3 className="text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-white transition-colors">
          {title}
        </h3>
        <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">
          {description}
        </p>

        <div className="flex items-center gap-2 text-sm font-semibold text-white/60 group-hover:text-white group-hover:gap-3 transition-all duration-300">
          <span>Explore</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  </Link>
);

export default function Home() {
  const { isAuthenticated, name, logout } = useAuth();
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);

  const loaderRef = useRef(null);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const rewriteRef = useRef(null);
  const demoRef = useRef(null);
  const ctaRef = useRef(null);

  /* ─── PRELOADER ─── */
  useLayoutEffect(() => {
    document.body.style.overflow = "hidden";

    const counter = { val: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        setShowContent(true);
        document.body.style.overflow = "visible";
      },
    });

    tl.to(counter, {
      val: 100,
      duration: 1.8,
      ease: "power2.inOut",
      onUpdate: () => setProgress(Math.floor(counter.val)),
    });

    tl.to(
      loaderRef.current,
      {
        yPercent: -100,
        duration: 0.9,
        ease: "power3.inOut",
        delay: 0.2,
      },
      "-=0.4"
    );

    return () => {
      tl.kill();
      document.body.style.overflow = "visible";
    };
  }, []);

  /* ─── HERO ANIMATIONS ─── */
  useEffect(() => {
    if (!showContent || !heroRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-word", {
        y: "120%",
        duration: 1.3,
        stagger: 0.1,
        ease: "expo.out",
      })
        .from(".hero-sub", { opacity: 0, y: 30, duration: 0.9 }, "-=0.7")
        .from(
          ".floating-badge",
          {
            scale: 0,
            opacity: 0,
            rotation: -30,
            duration: 0.9,
            stagger: 0.08,
            ease: "back.out(1.8)",
          },
          "-=0.9"
        );

      // Gentle floating animation for badges
      gsap.utils.toArray(".floating-badge").forEach((badge, i) => {
        gsap.to(badge, {
          y: 12 + i * 4,
          rotation: `+=${6 + i * 3}`,
          duration: 3.5 + i * 0.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.2,
        });
      });

      // Scroll indicator
      gsap.fromTo(
        ".scroll-indicator",
        { opacity: 0, y: -15 },
        { opacity: 1, y: 0, duration: 0.8, delay: 1.2 }
      );

      gsap.to(".scroll-indicator", {
        y: 10,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, heroRef.current);

    return () => ctx.revert();
  }, [showContent]);

  /* ─── FEATURES SECTION ─── */
  useEffect(() => {
    if (!showContent || !featuresRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".features-header", {
        scrollTrigger: { trigger: ".features-header", start: "top 80%" },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(".feature-card", {
        scrollTrigger: { trigger: ".features-grid", start: "top 75%" },
        y: 80,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
      });
    }, featuresRef.current);

    return () => ctx.revert();
  }, [showContent]);

  /* ─── REWRITE SECTION ─── */
  useEffect(() => {
    if (!showContent || !rewriteRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: rewriteRef.current, start: "top 70%" },
      });

      tl.from(".rewrite-header", { y: 40, opacity: 0, duration: 0.8 })
        .from(".rewrite-bad", { x: -50, opacity: 0, duration: 0.6 }, "-=0.4")
        .from(".rewrite-arrow", { scale: 0, rotation: 180, duration: 0.6, ease: "back.out(2)" }, "-=0.3")
        .from(".rewrite-good", { x: 50, opacity: 0, scale: 0.92, duration: 0.7 }, "-=0.3")
        .from(".rewrite-badge", { scale: 0, duration: 0.5, ease: "back.out(3)" }, "-=0.4");
    }, rewriteRef.current);

    return () => ctx.revert();
  }, [showContent]);

  /* ─── DEMO VIDEO SECTION ─── */
  useEffect(() => {
    if (!showContent || !demoRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".demo-header", {
        scrollTrigger: { trigger: ".demo-header", start: "top 80%" },
        y: 50,
        opacity: 0,
        duration: 1,
      });

      gsap.from(".demo-video", {
        scrollTrigger: {
          trigger: ".demo-video",
          start: "top 80%",
          end: "top 30%",
          scrub: 1.2,
        },
        scale: 0.88,
        borderRadius: "80px",
      });

      gsap.from(".demo-floating-ui", {
        scrollTrigger: { trigger: ".demo-video", start: "center 65%" },
        y: 70,
        opacity: 0,
        duration: 1,
        ease: "back.out(1.4)",
      });
    }, demoRef.current);

    return () => ctx.revert();
  }, [showContent]);

  /* ─── CTA SECTION ─── */
  useEffect(() => {
    if (!showContent || !ctaRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".cta-content", {
        scrollTrigger: { trigger: ctaRef.current, start: "top 75%" },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
    }, ctaRef.current);

    return () => ctx.revert();
  }, [showContent]);

  const features = [
    {
      icon: <ImageIcon size={24} />,
      title: "AI Image Studio",
      description: "Turn text prompts into stunning high-resolution visuals. Photorealistic, artistic, or abstract.",
      gradient: "from-purple-600 to-pink-500",
      link: "/image",
    },
    {
      icon: <FileText size={24} />,
      title: "Content Engine",
      description: "Rewrite, expand, shorten, or generate articles from scratch with multiple tones.",
      gradient: "from-blue-600 to-cyan-500",
      link: "/content",
    },
    {
      icon: <BarChart3 size={24} />,
      title: "Resume Rater",
      description: "Upload your PDF resume and get an instant AI-powered ATS score with feedback.",
      gradient: "from-emerald-500 to-teal-500",
      link: "/resume/analyze",
    },
  ];

  return (
    <>
      {/* PRELOADER */}
      <div
        ref={loaderRef}
        className="fixed inset-0 z-[200] flex items-end justify-between bg-[#060a13] px-6 py-8 md:px-12 overflow-hidden"
      >
        <div className="text-sm font-heading uppercase tracking-[0.3em] text-white/40">
          Creatdiv AI <br /> Est. 2026
        </div>
        <div className="text-[18vw] md:text-[14rem] font-black leading-none tracking-[-0.05em] text-white/[0.06] select-none">
          {progress}%
        </div>
      </div>

      {showContent && (
        <div className="bg-[#060a13] text-white min-h-screen overflow-x-hidden font-sans">
          {/* NAV */}
          <nav className="fixed top-0 left-0 z-[100] flex w-full items-center justify-between px-5 py-5 md:px-8 md:py-7">
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#060a13]/95 via-[#060a13]/65 to-transparent pointer-events-none" />
            <Link to="/" className="relative text-2xl font-bold tracking-tighter text-white">
              Creatdiv.
            </Link>
            <div className="relative flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] p-1.5 shadow-2xl shadow-black/20 backdrop-blur-xl">
              {isAuthenticated ? (
                <>
                  <div className="hidden items-center gap-2 rounded-full px-3 py-1.5 sm:flex">
                    <span className="size-2 rounded-full bg-emerald-300 shadow-[0_0_16px_rgba(110,231,183,0.45)]" />
                    <span className="text-sm font-semibold text-white/75">
                      {name || "Saket"}
                    </span>
                  </div>
                  <Link
                    to="/content"
                    className="hidden rounded-full px-4 py-2 text-sm font-semibold text-white/55 transition-colors hover:bg-white/7 hover:text-white sm:block"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="rounded-full border border-white/10 bg-white/10 px-5 py-2 text-sm font-bold text-white shadow-sm transition-all hover:border-white/20 hover:bg-white/16"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="hidden rounded-full px-4 py-2 text-sm font-semibold text-white/60 transition-colors hover:bg-white/7 hover:text-white sm:block"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-full bg-white px-5 py-2 text-sm font-bold text-[#060a13] shadow-[0_16px_40px_rgba(255,255,255,0.12)] transition-all hover:bg-white/92 active:scale-95"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </nav>

          {/* HERO */}
          <section
            ref={heroRef}
            className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 pt-24"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.055),transparent_34%),linear-gradient(to_bottom,rgba(255,255,255,0.035),transparent_42%)]" />
            <div
              className="absolute inset-0 opacity-[0.045]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
                backgroundSize: "64px 64px",
                maskImage: "linear-gradient(to bottom, black, transparent 72%)",
              }}
            />
            <div className="absolute inset-x-0 top-[18%] h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />

            {/* Floating AI Brand Badges */}
            <FloatingBadge
              icon={<OpenAIIcon size={17} />}
              label="OpenAI"
              color="#10a37f"
              className="top-[23%] left-[7%] md:left-[13%]"
              rotation={-7}
            />
            <FloatingBadge
              icon={<GeminiIcon size={17} />}
              label="Gemini"
              color="#4285F4"
              className="top-[20%] right-[7%] md:right-[16%]"
              rotation={8}
            />
            <FloatingBadge
              icon={<HuggingFaceIcon size={17} />}
              label="Hugging Face"
              color="#FFD21E"
              className="bottom-[29%] left-[5%] md:left-[10%]"
              rotation={6}
            />
            <FloatingBadge
              icon={<MidjourneyIcon size={17} />}
              label="Midjourney"
              color="#ffffff"
              className="bottom-[27%] right-[6%] md:right-[12%]"
              rotation={-6}
            />

            <div className="relative z-10 text-center max-w-5xl">
              <div className="hero-sub mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/50 backdrop-blur-xl">
                <span className="size-1.5 rounded-full bg-white/55" />
                Creative systems for modern teams
              </div>
              <div className="overflow-hidden mb-2">
                <h1 className="hero-word text-[13vw] md:text-[10vw] lg:text-[8rem] font-black leading-[0.88] tracking-[-0.04em]">
                  What can
                </h1>
              </div>
              <div className="overflow-hidden mb-2">
                <h1 className="hero-word text-[13vw] md:text-[10vw] lg:text-[8rem] font-black leading-[0.88] tracking-[-0.04em]">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
                    AI create
                  </span>
                </h1>
              </div>
              <div className="overflow-hidden">
                <h1 className="hero-word text-[13vw] md:text-[10vw] lg:text-[8rem] font-black leading-[0.88] tracking-[-0.04em]">
                  for you?
                </h1>
              </div>

              <div className="hero-sub mt-8 md:mt-12">
                <p className="mx-auto max-w-2xl text-lg font-medium leading-8 text-white/62 md:text-xl md:leading-9">
                  Generate images, rewrite content, analyze resumes — all powered
                  by next-gen AI models. One platform, infinite possibilities.
                </p>

                <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link to={isAuthenticated ? "/image/generate" : "/register"}>
                    <button className="group flex min-w-44 items-center justify-center gap-3 rounded-full bg-white px-9 py-4 text-[#060a13] font-bold shadow-[0_20px_55px_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(0,0,0,0.14)] transition-all hover:-translate-y-0.5 hover:bg-white/95 active:translate-y-0">
                      Go to Studio
                      <ArrowRight size={19} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                  <Link to="/image/generate">
                    <button className="flex min-w-44 items-center justify-center gap-3 rounded-full border border-white/12 bg-white/[0.055] px-8 py-4 font-semibold text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-white/24 hover:bg-white/[0.085] hover:text-white active:translate-y-0">
                      <Wand2 size={18} /> Try Image Gen
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="scroll-indicator absolute bottom-8 md:bottom-11 flex flex-col items-center gap-3 text-white/50">
              <span className="rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.26em] backdrop-blur-md">
                Scroll to explore
              </span>
              <ArrowDown size={17} className="text-white/45" />
            </div>
          </section>

          {/* FEATURES SECTION */}
          <section ref={featuresRef} className="py-24 md:py-32 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="features-header text-center mb-16 md:mb-20">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-white/50 mb-6">
                  <Sparkles size={13} /> CORE TOOLS
                </div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">
                  Three tools. <span className="text-white/30">Endless output.</span>
                </h2>
              </div>

              <div className="features-grid grid grid-cols-1 md:grid-cols-3 gap-6">
                {features.map((feature, i) => (
                  <FeatureCard key={feature.title} {...feature} index={i} />
                ))}
              </div>
            </div>
          </section>

          {/* REWRITE DEMO */}
          <section ref={rewriteRef} className="relative py-24 md:py-32 px-4">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/10 rounded-full blur-[120px]" />

            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="rewrite-header">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
                  <Sparkles size={12} /> REWRITE ENGINE
                </div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight mb-6">
                  Refine your text <span className="text-white/30">with precision.</span>
                </h2>
                <p className="text-white/40 text-base leading-relaxed max-w-md">
                  Transform your content instantly. Fix grammar, change tone, and expand ideas — without losing your voice.
                </p>
                <Link to="/content">
                  <button className="mt-8 flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors group">
                    Try Content Engine
                    <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>

              <div className="relative">
                <div className="absolute -inset-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl opacity-60" />
                <div className="relative flex flex-col gap-5">
                  <div className="rewrite-bad bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl flex gap-4 items-start">
                    <XCircle className="text-red-400 shrink-0 mt-1" size={24} />
                    <p className="text-white/30 text-sm line-through">"hey can u check this its bad."</p>
                  </div>

                  <div className="rewrite-arrow flex justify-center py-3">
                    <div className="bg-white/10 p-3 rounded-full border border-white/10 text-white/40">
                      <ArrowDown size={20} />
                    </div>
                  </div>

                  <div className="rewrite-good bg-white/10 backdrop-blur-sm border border-blue-500/30 p-6 rounded-2xl flex gap-4 items-start shadow-xl">
                    <CheckCircle2 className="text-blue-400 shrink-0 mt-1" size={24} />
                    <div>
                      <p className="text-white font-medium">
                        "Could you please review this draft? I believe it requires improvement."
                      </p>
                      <span className="rewrite-badge mt-4 inline-block px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider rounded">
                        Professional Tone
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* DEMO VIDEO SECTION */}
          <section ref={demoRef} className="relative py-24 md:py-32 px-4">
            <div className="demo-header text-center mb-16">
              <span className="text-purple-400 font-bold uppercase tracking-widest text-xs mb-4 block">WORKFLOW</span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">
                Turn words into <span className="text-white/30">worlds instantly.</span>
              </h2>
            </div>

            <div className="demo-video mx-auto w-full max-w-[92vw] md:max-w-5xl h-[55vh] md:h-[75vh] overflow-hidden shadow-2xl shadow-purple-500/10 relative rounded-[2.5rem] border border-white/10 bg-[#0a0f1f]">
              <video
                src="/assets/pro.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-75"
              />

              <div className="demo-floating-ui absolute bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-xl bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-5 flex items-center gap-5">
                <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white shrink-0">
                  <Sparkles size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="h-2 w-24 bg-white/30 rounded-full mb-3" />
                  <p className="text-white text-sm font-medium line-clamp-1">
                    "A futuristic city with flying cars at sunset..."
                  </p>
                </div>
                <div className="px-4 py-2 bg-white/90 text-black text-xs font-bold rounded-xl uppercase tracking-wider">
                  Generating
                </div>
              </div>
            </div>
          </section>

          {/* STATS */}
          <section className="py-16 border-y border-white/5">
            <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
              {[
                { num: "50K+", label: "Images Generated" },
                { num: "120K+", label: "Content Rewrites" },
                { num: "15K+", label: "Resumes Analyzed" },
                { num: "99.2%", label: "Uptime" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-4xl md:text-5xl font-black tracking-tight text-white">{stat.num}</div>
                  <div className="text-xs font-semibold text-white/40 uppercase tracking-widest mt-2">{stat.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* FINAL CTA */}
          <section ref={ctaRef} className="relative py-32 md:py-40 px-4">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px]" />

            <div className="cta-content relative z-10 text-center max-w-3xl mx-auto">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95] mb-6">
                Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">create something?</span>
              </h2>
              <p className="text-white/40 text-lg mb-10 max-w-lg mx-auto">
                Join thousands of creators using Creatdiv to generate stunning visuals, polished copy, and optimized resumes.
              </p>
              <Link to={isAuthenticated ? "/content" : "/register"}>
                <button className="group inline-flex items-center gap-3 rounded-full bg-white px-12 py-6 text-[#060a13] font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-2xl">
                  {isAuthenticated ? "Go to Dashboard" : "Get Started — It's Free"}
                  <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="border-t border-white/5 py-12 px-6">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm">
              <div className="text-white/20">© 2026 Creatdiv AI. All rights reserved.</div>
              <div className="flex gap-8 text-white/30">
                <Link to="/content" className="hover:text-white transition-colors">Content</Link>
                <Link to="/image" className="hover:text-white transition-colors">Images</Link>
                <Link to="/resume/analyze" className="hover:text-white transition-colors">Resume</Link>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/10">Built with AI</div>
            </div>
          </footer>
        </div>
      )}
    </>
  );
}
