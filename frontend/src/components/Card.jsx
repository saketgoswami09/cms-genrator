import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const Card = ({ feature }) => {
  return (
    <Link to={feature.link} className="group block">
      <div className="relative h-full overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/40 p-8 backdrop-blur-xl transition-all duration-500 hover:border-white/60 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] active:scale-[0.98]">
        {/* 🔥 Soft Glow Background (Hover par dikhega) */}
        <div
          className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${feature.gradient} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20`}
        />

        <div className="mb-8 flex items-center justify-between">
          <div
            className={`flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg`}
          >
            {feature.icon}
          </div>

          {feature.badge && (
            <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/50 text-gray-800 border border-white/20 backdrop-blur-md">
              {feature.badge}
            </span>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight group-hover:text-indigo-600 transition-colors">
            {feature.title}
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed font-medium">
            {feature.description}
          </p>
        </div>

        {/* Explore Button Styling */}
        <div className="mt-8 flex items-center gap-2 text-sm font-bold text-gray-900 transition-all duration-500 group-hover:gap-3">
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
