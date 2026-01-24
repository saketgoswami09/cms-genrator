import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Image as ImageIcon, LogOut, User, LogIn } from "lucide-react";

export default function Nav() {
  const navigate = useNavigate();

  // 🛠️ ACTUAL LOGIC: 
  // Get 'user' from your AuthContext or parse it from localStorage
  const user = JSON.parse(localStorage.getItem("user")); 
  const isAuthenticated = !!user; 

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="hero-fade absolute top-0 left-0 w-full p-6 md:p-8 flex items-center justify-between text-white mix-blend-difference z-50">
      {/* BRAND */}
      <Link to="/" className="hover:opacity-80 transition-opacity">
        <div className="text-2xl font-bold tracking-tighter">Creatdiv.</div>
      </Link>

      {/* CENTER LINKS (AI TOOLS) */}
      <div className="hidden md:flex items-center gap-8 bg-white/5 backdrop-blur-md px-6 py-2 rounded-full border border-white/10">
        <Link to="/rewrite" className="text-sm font-medium flex items-center gap-2 hover:text-blue-400 transition-colors">
          <Sparkles size={14} /> Content
        </Link>
        <Link to="/generate-image" className="text-sm font-medium flex items-center gap-2 hover:text-purple-400 transition-colors">
          <ImageIcon size={14} /> Image
        </Link>
        
      </div>

      {/* RIGHT SIDE (AUTH) */}
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            {/* 🔥 USER NAME DISPLAY */}
            <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] uppercase tracking-widest text-white/50">Welcome</span>
                <span className="text-sm font-bold tracking-tight">{user.name}</span>
            </div>

            <div className="flex items-center gap-2">
                <Link to="/history" className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition border border-white/10">
                    <User size={18} />
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2 hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
                <button 
                  onClick={handleLogout}
                  className="p-2 hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogIn size={18} />
                </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-semibold hover:opacity-70 transition">Login</Link>
            <Link to="/register">
              <button className="rounded-full bg-white px-6 py-2 text-sm font-bold text-black hover:bg-gray-200 transition">
                Sign Up
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}