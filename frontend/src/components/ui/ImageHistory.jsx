import React, { useState, useLayoutEffect, useEffect, useRef } from "react";
import gsap from "gsap";
import {
  Download,
  Trash2,
  Copy,
  Check, // Added Check icon
  Maximize2,
  Image as ImageIcon,
  Calendar,
  X,
  Clock // Added Clock icon
} from "lucide-react";
import { toast } from "react-toastify";
import { imageHistory,  } from "../../../services/image";

// --- HELPER: Group data by date ---
const groupHistoryByDate = (history) => {
  const groups = {
    Today: [],
    Yesterday: [],
    "Past 7 Days": [],
    Older: [],
  };

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  history.forEach((item) => {
    const date = new Date(item.rawDate); // Ensure we keep a raw Date object
    
    if (date.toDateString() === today.toDateString()) {
      groups.Today.push(item);
    } else if (date.toDateString() === yesterday.toDateString()) {
      groups.Yesterday.push(item);
    } else if (date > new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)) {
      groups["Past 7 Days"].push(item);
    } else {
      groups.Older.push(item);
    }
  });

  // Remove empty groups
  return Object.entries(groups).filter(([_, items]) => items.length > 0);
};

export default function ImageHistory({ refreshTrigger }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [copiedId, setCopiedId] = useState(null); // Track copied state per item
  const containerRef = useRef(null);

  // FETCH DATA
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (history.length === 0) setLoading(true);
        const res = await imageHistory();

        const formatted = res.data.data.map((item) => ({
          id: item._id,
          url: item.image_url,
          prompt: item.prompt,
          resolution: item.resolution,
          rawDate: item.createdAt, // Keep raw for sorting
          date: new Date(item.createdAt).toLocaleDateString(),
        }));

        setHistory(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [refreshTrigger]);

  // ANIMATION
  useLayoutEffect(() => {
    if (loading || history.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".history-card",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power2.out" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [history, loading]);

  // ACTIONS
  // const handleDelete = async (id) => {
  //   try {
  //     await deleteImage(id);
  //     setHistory((prev) => prev.filter((item) => item.id !== id));
  //     toast.info("Image removed");
  //   } catch {
  //     toast.error("Failed to delete");
  //   }
  // };

  const handleCopyPrompt = async (id, prompt) => {
    await navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000); // Reset after 2s
  };

  const handleDownload = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `ai-image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      toast.error("Failed to download");
    }
  };

  const groupedHistory = groupHistoryByDate(history);

  return (
    <div className="w-full px-4 font-sans">
      <div ref={containerRef} className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-8 border-b border-gray-200 pb-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Clock className="text-purple-600" size={24} />
                History
            </h2>
        </div>

        {/* LOADING SKELETON */}
        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white p-2 shadow-sm border border-gray-100">
                <div className="aspect-square w-full rounded-xl bg-gray-100 animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && history.length === 0 && (
          <div className="flex flex-col items-center py-20 text-center text-gray-400">
            <div className="mb-4 rounded-full bg-gray-100 p-5">
              <ImageIcon size={40} className="opacity-40" />
            </div>
            <p className="text-sm">No images generated yet.</p>
          </div>
        )}

        {/* GROUPED LIST */}
        {!loading && groupedHistory.map(([label, items]) => (
          <div key={label} className="mb-10">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500 pl-1">
              {label}
            </h3>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="history-card group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-900/5 transition-all hover:shadow-xl hover:ring-purple-500/20"
                >
                  {/* IMAGE */}
                  <div className="aspect-square w-full overflow-hidden bg-gray-100 relative cursor-pointer">
                    <img
                      src={item.url}
                      alt="Gen"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onClick={() => setSelectedImage(item)}
                    />
                    
                    {/* Resolution Tag */}
                    <div className="absolute top-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.resolution}
                    </div>

                    {/* HOVER ACTIONS (Glassmorphism) */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 transition-all duration-300 group-hover:opacity-100 flex items-center justify-center gap-2 backdrop-blur-[2px]">
                      <ActionBtn icon={Maximize2} onClick={() => setSelectedImage(item)} tooltip="View" />
                      <ActionBtn icon={Download} onClick={() => handleDownload(item.url)} tooltip="Download" />
                      <ActionBtn icon={Trash2} onClick={() => handleDelete(item.id)} tooltip="Delete" danger />
                    </div>
                  </div>

                  {/* DETAILS */}
                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div className="mb-3">
                      <p className="line-clamp-2 text-sm text-gray-700 leading-relaxed" title={item.prompt}>
                        {item.prompt}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                      <span className="text-[11px] font-medium text-gray-400">
                        {new Date(item.rawDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      
                      <button
                        onClick={() => handleCopyPrompt(item.id, item.prompt)}
                        className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium transition-colors ${
                          copiedId === item.id 
                            ? "bg-green-50 text-green-600" 
                            : "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                      >
                        {copiedId === item.id ? <Check size={12} /> : <Copy size={12} />}
                        {copiedId === item.id ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* FULLSCREEN MODAL */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition"
          >
            <X size={28} />
          </button>
          
          <div className="max-w-5xl w-full flex flex-col items-center">
            <img
              src={selectedImage.url}
              alt="Fullscreen"
              className="max-h-[80vh] w-auto object-contain rounded-lg shadow-2xl"
            />
            <p className="mt-6 text-center text-white/80 max-w-2xl text-lg font-light">
                {selectedImage.prompt}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Small helper component for hover buttons
const ActionBtn = ({ icon: Icon, onClick, danger, tooltip }) => (
    <button
      onClick={(e) => {
          e.stopPropagation();
          onClick();
      }}
      title={tooltip}
      className={`rounded-full p-2.5 backdrop-blur-md transition-all transform hover:scale-110 ${
        danger 
          ? "bg-red-500/80 text-white hover:bg-red-600" 
          : "bg-white/90 text-gray-900 hover:bg-white"
      }`}
    >
      <Icon size={18} />
    </button>
);