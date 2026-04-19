import React, { useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";

const Card = ({ feature }) => {
  const cardRef = useRef(null);

  /* ─── Magnetic tilt on mouse move ─── */
  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    gsap.to(card, {
      rotateX,
      rotateY,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 800,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.5)",
    });
  }, []);

  return (
    <Link to={feature.link} className="group block">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative h-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 transition-all duration-500 hover:border-white/20 hover:bg-white/[0.08] active:scale-[0.98]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Soft glow on hover */}
        <div
          className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${feature.gradient} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-25`}
        />

        <div className="mb-8 flex items-center justify-between">
          <div
            className={`flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg`}
          >
            {feature.icon}
          </div>

          {feature.badge && (
            <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/10 text-white/70 border border-white/10">
              {feature.badge}
            </span>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-white tracking-tight group-hover:text-white transition-colors">
            {feature.title}
          </h3>
          <p className="text-white/40 text-sm leading-relaxed font-medium">
            {feature.description}
          </p>
        </div>

        {/* Explore Button */}
        <div className="mt-8 flex items-center gap-2 text-sm font-bold text-white/50 transition-all duration-500 group-hover:text-white group-hover:gap-3">
          <span>Explore Tool</span>
          <div
            className={`p-1 rounded-full bg-gradient-to-br ${feature.gradient} text-white`}
          >
            <ArrowUpRight size={14} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;
