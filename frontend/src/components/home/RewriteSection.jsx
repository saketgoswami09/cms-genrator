import React from "react";
import { ArrowRight, Sparkles, XCircle, CheckCircle2 } from "lucide-react";

const RewriteSection = () => (
  <section className="rewrite-section py-32 bg-[#F8F9FA] my-12 rounded-[48px] overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mb-6">
          <Sparkles size={12} /> Rewrite V2
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-[1.1]">
          Refine your text <br /> with precision.
        </h2>
        <p className="text-lg text-gray-500 mb-8 leading-relaxed max-w-md">
          Transform your content instantly. Fix grammar, change tone, and expand ideas without losing your voice.
        </p>
      </div>

      <div className="relative perspective-1000">
        <div className="absolute -inset-10 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl opacity-50"></div>
        <div className="relative flex flex-col gap-6">
          {/* Bad Card */}
          <div className="rewrite-card-bad bg-white p-6 rounded-2xl shadow-sm border border-red-100 flex gap-4 items-start opacity-50">
            <XCircle className="text-red-400 shrink-0" size={24} />
            <p className="text-gray-400 text-sm line-through decoration-red-300">"hey can u check this its bad."</p>
          </div>
          {/* Arrow */}
          <div className="rewrite-arrow flex justify-center py-2">
            <div className="bg-white p-2 rounded-full shadow-sm border border-gray-100 text-gray-400">
              <ArrowRight className="rotate-90" size={20} />
            </div>
          </div>
          {/* Good Card */}
          <div className="rewrite-card-good bg-white p-6 rounded-2xl shadow-xl border border-blue-100 flex gap-4 items-start scale-105">
            <CheckCircle2 className="text-blue-500 shrink-0" size={24} />
            <div>
              <p className="text-gray-900 font-medium text-lg">"Could you please review this draft? I believe it requires improvement."</p>
              <div className="rewrite-badge mt-3 inline-block px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded">Professional Tone</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default RewriteSection;