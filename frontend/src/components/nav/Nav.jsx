import React, { useState } from "react"; // Added useState
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { Sparkles, Image as ImageIcon, LogOut, Menu, X, Info, BarChart } from "lucide-react";

export default function Nav() {
  const navigate = useNavigate();
  const { isAuthenticated, name: userName, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Mobile menu state
  React.useEffect(() => {
  if (isMenuOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'unset';
  }
  return () => { document.body.style.overflow = 'unset'; };
}, [isMenuOpen]);
  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMenuOpen(false);
  };

  return (
    <nav className="hero-fade absolute top-0 left-0 w-full p-6 md:p-8 flex items-center justify-between text-white mix-blend-difference z-[100] font-sans">
      {/* BRAND */}
      <Link to="/" className="flex items-center space-x-2 group">
        <div className="text-2xl font-bold tracking-tighter">Creatdiv.</div>
      </Link>

      {/* CENTER LINKS - Desktop Only */}
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
          <Link
            to="/resume/analyze"
            className="text-sm font-semibold flex items-center gap-2 hover:text-blue-400 transition-colors"
          >
            <BarChart size={14} /> Rate your Resume
          </Link>
          
        </div>
      )}

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <div className="flex items-center gap-3 md:gap-5">
            <div className="hidden sm:flex flex-col items-end leading-none">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-1">
                Welcome
              </span>
              <span className="text-sm font-bold">{userName}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center border border-white/20 shadow-lg ring-2 ring-black">
                <span className="text-sm font-bold text-white">
                  {userName?.charAt(0).toUpperCase()}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="hidden md:block p-2.5 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
                title="Logout"
              >
                <LogOut size={18} />
              </button>

              {/* 🍔 BURGER BUTTON - Mobile Only */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-white transition-all active:scale-90"
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-bold hover:text-white/70 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-6 py-2 text-sm font-bold text-black bg-white rounded-full shadow-xl"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
      {/* 📱 MOBILE OVERLAY MENU */}
      <div
        className={`fixed inset-0 w-full h-screen z-[1000] transition-all duration-500 ease-in-out ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* 1. COMPLETELY SOLID BACKGROUND */}
        <div className="absolute inset-0 bg-white">
          {/* Dotted Pattern Layer */}
          <div
            className="absolute inset-0 opacity-[0.4]"
            style={{
              backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        {/* 2. MENU CONTENT CONTAINER */}
        <div className="relative h-full flex flex-col items-center justify-center p-8">
          {/* BRAND - Adding it back in the menu for orientation */}
          <div className="absolute top-10 left-10 text-xl font-bold tracking-tighter text-gray-900">
            Creatdiv.
          </div>

          {/* CLOSE BUTTON - Solid black for contrast */}
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-8 right-8 p-3 text-gray-900 bg-gray-100 rounded-full active:scale-90 transition-all"
          >
            <X size={28} />
          </button>

          {/* NAVIGATION LINKS */}
          <div className="flex flex-col items-center gap-10 text-center">
            {[
              { name: "Home", path: "/" },
              { name: "Content Engine", path: "/content" },
              { name: "Image Studio", path: "/image" },
              { name: "History", path: "/history" },
            ].map((link, index) => (
              <Link
                key={index}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="text-4xl font-black tracking-tighter text-gray-900 active:text-blue-600 transition-colors"
              >
                {link.name}
              </Link>
            ))}

            {isAuthenticated && (
              <div className="mt-6 flex flex-col items-center gap-6">
                <div className="h-[2px] w-8 bg-gray-200" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-500 text-lg font-bold"
                >
                  <LogOut size={20} /> Logout
                </button>
              </div>
            )}
          </div>

          {/* BOTTOM INFO */}
          <div className="absolute bottom-10 text-gray-300 text-[10px] font-bold uppercase tracking-[0.4em]">
            Built with Creatdiv AI
          </div>
        </div>
      </div>
    </nav>
  );
}
