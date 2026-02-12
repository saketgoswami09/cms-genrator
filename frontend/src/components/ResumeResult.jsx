import React from "react";
import { ShieldCheck, Zap, BarChart3, Info, Target, Award } from "lucide-react";
import { motion } from "framer-motion"; 

export const ResumeResult = ({ result }) => {
  if (!result) return null;

  // Animation variants for cleaner code
  const containerVars = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
  };

  const itemVars = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      variants={containerVars}
      initial="initial"
      animate="animate"
      className="mt-16 space-y-10 max-w-5xl mx-auto pb-20 px-4"
    >
      
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="relative group cursor-default"
      >
        <div className="absolute -inset-1 bg-linear-to-r from-purple-600 to-blue-600 rounded-[3rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
        
        <div className="relative overflow-hidden rounded-[3rem] border border-white/40 bg-white/60 backdrop-blur-2xl p-12 text-center shadow-2xl">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            className="flex justify-center mb-6"
          >
            <div className="p-4 rounded-3xl bg-purple-500/10 text-purple-600">
               <Award size={40} strokeWidth={1.5} />
            </div>
          </motion.div>
          
          <h2 className="text-xs font-black uppercase tracking-[0.4em] text-gray-400 mb-4">
             AI Quality Index
          </h2>
          
          <div className="relative inline-block">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-gray-900 via-gray-800 to-gray-500"
            >
              {result.score}
            </motion.span>
            <span className="absolute -right-12 bottom-4 text-3xl font-bold text-purple-600">/10</span>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
            <div className="px-6 py-2 rounded-2xl bg-white/50 border border-white shadow-sm flex items-center gap-3">
              <motion.div 
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="size-2 rounded-full bg-purple-500" 
              />
              <span className="text-sm font-bold text-gray-700">ATS Match: {result.match_percentage}%</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        
        <motion.div 
          variants={itemVars}
          className="relative overflow-hidden p-8 rounded-[2.5rem] bg-white/40 border-l-8 border-emerald-500 shadow-xl backdrop-blur-md"
        >
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck size={24} className="text-emerald-600" />
            <h3 className="text-xl font-bold text-gray-800">Key Strengths</h3>
          </div>
          <ul className="space-y-4">
            {result.strengths?.map((s, i) => (
              <motion.li key={i} whileHover={{ x: 5 }} className="flex items-start gap-3">
                <div className="mt-1.5 size-1.5 rounded-full bg-emerald-500 shrink-0" />
                <p className="text-gray-600 font-medium leading-relaxed">{s}</p>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div 
          variants={itemVars}
          className="relative overflow-hidden p-8 rounded-[2.5rem] bg-white/40 border-l-8 border-amber-500 shadow-xl backdrop-blur-md"
        >
          <div className="flex items-center gap-3 mb-6">
            <Zap size={24} className="text-amber-600" />
            <h3 className="text-xl font-bold text-gray-800">Room for Growth</h3>
          </div>
          <ul className="space-y-4">
            {result.improvements?.map((imp, i) => (
              <motion.li key={i} whileHover={{ x: 5 }} className="flex items-start gap-3">
                <div className="mt-1.5 size-1.5 rounded-full bg-amber-500 shrink-0" />
                <p className="text-gray-600 font-medium leading-relaxed">{imp}</p>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
};