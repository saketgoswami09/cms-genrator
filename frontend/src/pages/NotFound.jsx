import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#060a13] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-blue-400 mb-4">
          404
        </h1>
        <h2 className="text-2xl font-bold text-white mb-2">Page not found</h2>
        <p className="text-white/40 mb-8 text-sm leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:brightness-110 transition-all"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
