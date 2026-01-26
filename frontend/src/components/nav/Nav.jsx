import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { Sparkles, Image as ImageIcon, LogOut, Layout } from "lucide-react";

export default function Nav() {
  const navigate = useNavigate();
  const { isAuthenticated, name: userName, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="hero-fade absolute top-0 left-0 w-full p-6 md:p-8 flex items-center justify-between text-white mix-blend-difference z-50 font-sans">
      
      {/* BRAND - Unified with Creatdiv styling */}
      <Link to="/" className="flex items-center space-x-2 group">
        
        <div className="text-2xl font-bold tracking-tighter hidden sm:block">
          Creatdiv.
        </div>
      </Link>

      {/* CENTER LINKS - Pill design for AI Tools */}
      {isAuthenticated && (
        <div className="hidden md:flex items-center gap-6 bg-white/5 backdrop-blur-xl px-6 py-2 rounded-full border border-white/10 ring-1 ring-white/5 shadow-2xl">
          <Link
            to="/content"
            className="text-sm font-semibold flex items-center gap-2 hover:text-blue-400 transition-colors"
          >
            <Sparkles size={14} /> Content
          </Link>
          <div className="w-px h-4 bg-white/20" />
          <Link
            to="/image"
            className="text-sm font-semibold flex items-center gap-2 hover:text-purple-400 transition-colors"
          >
            <ImageIcon size={14} /> Image
          </Link>
        </div>
      )}

      {/* RIGHT SIDE - User Profile & Auth */}
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <div className="flex items-center gap-5">
            {/* User Info Block */}
            <div className="hidden sm:flex flex-col items-end leading-none">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-1">Welcome</span>
              <span className="text-sm font-bold">{userName}</span>
            </div>

            {/* Avatar & Actions */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center border border-white/20 shadow-lg ring-2 ring-black">
                <span className="text-sm font-bold text-white">
                   {userName?.charAt(0).toUpperCase()}
                </span>
              </div>
              
              <button
                onClick={handleLogout}
                className="p-2.5 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-bold hover:text-white/70 transition">
              Login
            </Link>
            <Link
              to="/register"
              className="px-6 py-2 text-sm font-bold text-black bg-white rounded-full hover:bg-gray-200 transition-all active:scale-95 shadow-xl"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}