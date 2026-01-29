import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Layers, Check } from "lucide-react";

export const CustomSelect = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative w-full">
      <label className="text-[10px] font-black text-purple-500/60 uppercase tracking-[0.2em] mb-2 block ml-1">
        Resolution
      </label>

      {/* 🪄 Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border transition-all duration-300 ${
          isOpen 
          ? "bg-white border-purple-500 ring-4 ring-purple-500/10 shadow-lg" 
          : "bg-white/40 border-white/60 backdrop-blur-xl hover:bg-white/60 shadow-sm"
        }`}
      >
        <div className="flex items-center gap-3">
          <Layers size={18} className={isOpen ? "text-purple-600" : "text-gray-400"} />
          <span className="text-sm font-bold text-gray-800">
            {selectedOption?.label || "Select Resolution"}
          </span>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown size={18} className="text-gray-400" />
        </motion.div>
      </button>

      {/* 🧬 Animated Dropdown List */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Click outside to close overlay */}
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 5, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute z-20 w-full mt-2 p-2 rounded-2xl border border-white/60 bg-white/80 backdrop-blur-2xl shadow-2xl overflow-hidden"
            >
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
                    ? "bg-purple-600 text-white shadow-md shadow-purple-200" 
                    : "text-gray-600 hover:bg-purple-50 hover:text-purple-700"
                  }`}
                >
                  {option.label}
                  {value === option.value && <Check size={14} strokeWidth={3} />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};