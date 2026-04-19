import { useState, useLayoutEffect, useRef, useEffect } from "react";
import gsap from "gsap";
import {
  Copy,
  Trash2,
  FileText,
  ArrowRight,
  Calendar,
  Check,
  Filter,
  Sparkles,
  Quote,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  getContentHistory,
  deleteContentHistory, 
} from "@/services/content";

// 🔥 Accept refreshTrigger from parent
export default function ContentHistory({ refreshTrigger }) {
  const [history, setHistory] = useState([]);
  const [filterTone, setFilterTone] = useState("All");
  const [copiedId, setCopiedId] = useState(null);
  const [loading, setLoading] = useState(true);

  const containerRef = useRef(null);

  // ✅ FETCH FROM BACKEND
  // ✅ FETCH FROM BACKEND
  useEffect(() => {
    async function fetchHistory() {
      try {
        if (history.length === 0) setLoading(true);

        const res = await getContentHistory();

        // 🔍 DEBUG: Check what the API actually returned
        console.log("API Response:", res.data);

        // 🛠 FIX: Access res.data.data (because backend sends { success: true, data: [...] })
        // We also use optional chaining (?.) and fallback to empty array ([]) to prevent crashes
        const rawData = res.data?.data || [];

        const formattedData = rawData.map((item) => ({
          ...item,
          original: item.input_content || item.original,
          result: item.output_content || item.result,
          tone: item.tone || "Professional",
        }));

        setHistory(formattedData);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load content history");
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [history.length, refreshTrigger]);

  // ✅ ANIMATION
  useLayoutEffect(() => {
    if (!history.length) return;

    const ctx = gsap.context(() => {
      gsap.killTweensOf(".history-card"); // Reset animations to prevent conflicts
      gsap.fromTo(
        ".history-card",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, [history, filterTone]);

  // ✅ COPY
  const handleCopy = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    try {
      await deleteContentHistory(id);
      // Optimistic Update: Remove from UI immediately
      setHistory((prev) => prev.filter((item) => item._id !== id));
      toast.info("Deleted");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  // ✅ FILTER
  const filteredHistory =
    filterTone === "All"
      ? history
      : history.filter((item) => item.tone === filterTone);

  const uniqueTones = [
    "All",
    ...new Set(history.map((i) => i.tone).filter(Boolean)),
  ];

  if (loading && history.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-white/30 animate-pulse">
        Loading history...
      </div>
    );
  }

  return (
    <div className="w-full px-4 font-sans relative">
      <div ref={containerRef} className="relative z-10 max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <FileText className="text-blue-400" size={28} />
              Content History
            </h1>
            <p className="mt-2 text-white/40">
              Your past AI rewrites and transformations.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg border border-white/10">
            <Filter size={14} className="text-white/30 ml-2" />
            <select
              value={filterTone}
              onChange={(e) => setFilterTone(e.target.value)}
              className="bg-transparent text-sm font-medium text-white py-1.5 pr-8 pl-1 outline-none cursor-pointer"
            >
              {uniqueTones.map((tone) => (
                <option key={tone} value={tone}>
                  {tone}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* LIST */}
        {filteredHistory.length ? (
          <div className="grid gap-6">
            {filteredHistory.map((item) => (
              <div
                key={item._id}
                className="history-card bg-white/[0.04] rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                {/* META */}
                <div className="flex justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getToneColor(
                        item.tone,
                      )}`}
                    >
                      {item.tone}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-white/30">
                      <Calendar size={12} />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-white/20 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-full transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* CONTENT */}
                <div className="grid md:grid-cols-2 gap-6 relative items-stretch">
                  {/* ORIGINAL */}
                  <div className="relative p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="absolute -top-3 left-4 px-2 bg-[#060a13] text-[10px] font-semibold text-white/30 uppercase tracking-widest">
                      Original
                    </div>
                    <p className="text-sm text-white/40 font-mono leading-relaxed mt-2 whitespace-pre-wrap">
                      “{item.original}”
                    </p>
                  </div>

                  {/* ARROW (Desktop) */}
                  <div className="hidden md:flex flex-col justify-center items-center absolute left-1/2 -translate-x-1/2 h-full top-0 pointer-events-none opacity-20">
                    <ArrowRight size={24} className="text-white/10" />
                  </div>

                  {/* RESULT */}
                  <div className="relative p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                    <div className="absolute -top-3 left-4 px-2 bg-[#060a13] text-[10px] font-semibold text-blue-400 uppercase tracking-widest flex items-center gap-1">
                      <Sparkles size={10} /> Result
                    </div>
                    <p className="text-base text-white/80 font-medium leading-relaxed mt-2 whitespace-pre-wrap">
                      “{item.result}”
                    </p>

                    <button
                      onClick={() => handleCopy(item.result, item._id)}
                      className="absolute bottom-3 right-3 p-2 bg-white/5 rounded-lg border border-white/10 text-white/40 hover:text-blue-400 hover:border-blue-500/30 transition-all"
                      title="Copy"
                    >
                      {copiedId === item._id ? (
                        <Check size={14} className="text-green-500" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Quote size={32} className="text-white/10" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              No history yet
            </h3>
            <p className="text-white/40 mt-1">
              Generate content to see it here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// 🎨 Tone Badge Colors
function getToneColor(tone) {
  switch (tone) {
    case "Professional":
      return "bg-blue-500/10 text-blue-400";
    case "Casual":
      return "bg-orange-500/10 text-orange-400";
    case "Enthusiastic":
      return "bg-green-500/10 text-green-400";
    case "Concise":
      return "bg-purple-500/10 text-purple-400";
    default:
      return "bg-white/10 text-white/60";
  }
}
