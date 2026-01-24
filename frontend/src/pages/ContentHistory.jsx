import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
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
  deleteContentHistory, // Make sure this is exported from your api service
} from "../../services/content";

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
  }, [refreshTrigger]);

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
      <div className="flex items-center justify-center py-20 text-gray-400 animate-pulse">
        Loading history...
      </div>
    );
  }

  return (
    <div className="w-full px-4 font-sans relative">
      <div ref={containerRef} className="relative z-10 max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="text-blue-600" size={28} />
              Content History
            </h1>
            <p className="mt-2 text-gray-500">
              Your past AI rewrites and transformations.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
            <Filter size={14} className="text-gray-400 ml-2" />
            <select
              value={filterTone}
              onChange={(e) => setFilterTone(e.target.value)}
              className="bg-transparent text-sm font-medium text-gray-700 py-1.5 pr-8 pl-1 outline-none cursor-pointer hover:text-gray-900"
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
                className="history-card bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-100 transition-all duration-300"
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
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar size={12} />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* CONTENT */}
                <div className="grid md:grid-cols-2 gap-6 relative items-stretch">
                  {/* ORIGINAL */}
                  <div className="relative p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="absolute -top-3 left-4 px-2 bg-gray-50 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                      Original
                    </div>
                    <p className="text-sm text-gray-500 font-mono leading-relaxed mt-2 whitespace-pre-wrap">
                      “{item.original}”
                    </p>
                  </div>

                  {/* ARROW (Desktop) */}
                  <div className="hidden md:flex flex-col justify-center items-center absolute left-1/2 -translate-x-1/2 h-full top-0 pointer-events-none opacity-20">
                    <ArrowRight size={24} className="text-gray-400" />
                  </div>

                  {/* RESULT */}
                  <div className="relative p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                    <div className="absolute -top-3 left-4 px-2 bg-blue-50 text-[10px] font-semibold text-blue-500 uppercase tracking-widest flex items-center gap-1">
                      <Sparkles size={10} /> Result
                    </div>
                    <p className="text-base text-gray-800 font-medium leading-relaxed mt-2 whitespace-pre-wrap">
                      “{item.result}”
                    </p>

                    <button
                      onClick={() => handleCopy(item.result, item._id)}
                      className="absolute bottom-3 right-3 p-2 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-300 transition-all"
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
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Quote size={32} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              No history yet
            </h3>
            <p className="text-gray-500 mt-1">
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
      return "bg-blue-100 text-blue-700";
    case "Casual":
      return "bg-orange-100 text-orange-700";
    case "Enthusiastic":
      return "bg-green-100 text-green-700";
    case "Concise":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}
