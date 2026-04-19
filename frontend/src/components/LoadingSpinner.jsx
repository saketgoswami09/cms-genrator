import { Loader2 } from "lucide-react";

/**
 * LoadingSpinner — Full-screen loading overlay.
 * Used as Suspense fallback for lazy-loaded routes.
 */
export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[#060a13]">
      <div className="bg-white/[0.04] backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col items-center">
        <div className="relative flex items-center justify-center">
          <div className="absolute h-16 w-16 rounded-full border-4 border-white/5" />
          <div className="h-16 w-16 rounded-full border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
          <Loader2 className="absolute text-purple-400 animate-pulse" size={24} />
        </div>
        <div className="mt-6 text-center">
          <h3 className="text-white font-bold tracking-tight text-lg">Creatdiv AI</h3>
          <p className="text-white/30 text-xs font-medium uppercase tracking-[0.3em] mt-1">
            Loading...
          </p>
        </div>
      </div>
    </div>
  );
}