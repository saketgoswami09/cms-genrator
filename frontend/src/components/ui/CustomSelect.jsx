import { useState } from "react";
import { ChevronDown, Layers, Check } from "lucide-react";

export const CustomSelect = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative w-full">
      <label className="text-[10px] font-black text-purple-400/60 uppercase tracking-[0.2em] mb-2 block ml-1">
        Resolution
      </label>

      {/* 🪄 Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border transition-all duration-300 ${
          isOpen 
          ? "bg-white/10 border-purple-500 ring-4 ring-purple-500/10 shadow-lg" 
          : "bg-white/5 border-white/10 hover:bg-white/10"
        }`}
      >
        <div className="flex items-center gap-3">
          <Layers size={18} className={isOpen ? "text-purple-400" : "text-white/30"} />
          <span className="text-sm font-bold text-white">
            {selectedOption?.label || "Select Resolution"}
          </span>
        </div>
        <div className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
          <ChevronDown size={18} className="text-white/30" />
        </div>
      </button>

      {/* 🧬 Animated Dropdown List */}
      {isOpen && (
        <>
          {/* Click outside to close overlay */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

          <div className="absolute z-20 w-full mt-2 p-2 rounded-2xl border border-white/10 bg-[#0c1020] backdrop-blur-2xl shadow-2xl overflow-hidden">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  value === option.value 
                  ? "bg-purple-600 text-white shadow-md shadow-purple-500/20" 
                  : "text-white/60 hover:bg-white/5 hover:text-purple-400"
                }`}
              >
                {option.label}
                {value === option.value && <Check size={14} strokeWidth={3} />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
