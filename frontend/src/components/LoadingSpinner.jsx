import React from "react";
import { Loader2 } from "lucide-react"; // Using Lucide for a modern feel

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white/30 backdrop-blur-md">
      {/* Container with soft shadow and glass border */}
      <div className="bg-white/80 p-10 rounded-[2.5rem] border border-white/50 shadow-2xl flex flex-col items-center">
        
        {/* Animated Gradient Spinner */}
        <div className="relative flex items-center justify-center">
          <div className="absolute h-16 w-16 rounded-full border-4 border-gray-100/50"></div>
          <div className="h-16 w-16 rounded-full border-4 border-t-indigo-600 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          <Loader2 className="absolute text-indigo-600 animate-pulse" size={24} />
        </div>

        <div className="mt-6 text-center">
          <h3 className="text-gray-900 font-bold tracking-tight text-lg">Creatdiv AI</h3>
          <p className="text-gray-500 text-xs font-medium uppercase tracking-[0.3em] mt-1">
            Setting up your workspace...
          </p>
        </div>
      </div>
    </div>
  );
}