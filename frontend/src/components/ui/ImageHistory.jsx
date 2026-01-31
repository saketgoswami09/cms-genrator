import { useState, useLayoutEffect, useEffect, useRef } from "react";
import gsap from "gsap";
import {
  Download, Maximize2, 
  Image as ImageIcon, X, Clock, ExternalLink 
} from "lucide-react";
import { toast } from "react-toastify";
import { imageHistory } from "../../../services/image";
import { downloadImage } from "../../utils/global"; 

// --- HELPER: Group data by date logic remains the same ---
const groupHistoryByDate = (history) => {
  const groups = { Today: [], Yesterday: [], "Past 7 Days": [], Older: [] };
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  history.forEach((item) => {
    const date = new Date(item.rawDate);
    if (date.toDateString() === today.toDateString()) groups.Today.push(item);
    else if (date.toDateString() === yesterday.toDateString()) groups.Yesterday.push(item);
    else if (date > new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)) groups["Past 7 Days"].push(item);
    else groups.Older.push(item);
  });
  return Object.entries(groups).filter(([_, items]) => items.length > 0);
};

export default function ImageHistory({ refreshTrigger }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const containerRef = useRef(null);

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
          rawDate: item.createdAt,
        }));
        setHistory(formatted);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchHistory();
  }, [history.length, refreshTrigger]);

  useLayoutEffect(() => {
    if (loading || history.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".history-card",
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.04, ease: "power2.out" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [history, loading]);

  const handleCopyPrompt = async (id, prompt) => {
    await navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    toast.success("Prompt copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const groupedHistory = groupHistoryByDate(history);

  return (
    <div className="w-full font-sans">
      <div ref={containerRef} className="mx-auto max-w-7xl px-4">
        
        {/* HEADER */}
        <div className="mb-10 flex items-center justify-between border-b border-gray-100 pb-6">
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3 tracking-tighter">
                <Clock className="text-purple-600" size={28} />
                Creatdiv Archive
            </h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
                {history.length} Creations
            </p>
        </div>

        {/* LOADING SKELETON (Refined) */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square rounded-4xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        )}

        {/* LISTING */}
        {!loading && groupedHistory.map(([label, items]) => (
          <div key={label} className="mb-16">
            <h3 className="mb-6 text-[10px] font-black uppercase tracking-[0.3em] text-purple-500/60 pl-2">
              {label}
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((item) => (
                <div key={item.id} className="history-card group relative aspect-square rounded-4xl overflow-hidden bg-white shadow-sm ring-1 ring-gray-200 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
                  
                  {/* IMAGE */}
                  <img src={item.url} alt="AI" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />

                  {/* GLASS OVERLAY */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 backdrop-blur-[3px] transition-all duration-500 flex flex-col justify-between p-5">
                    <div className="flex justify-end gap-2">
                         <button onClick={() => downloadImage(item.url)} className="p-2.5 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all">
                            <Download size={18} />
                         </button>
                         <button onClick={() => setSelectedImage(item)} className="p-2.5 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all">
                            <Maximize2 size={18} />
                         </button>
                    </div>

                    <div className="space-y-3">
                        <p className="text-xs text-white/90 line-clamp-3 font-medium leading-relaxed italic">
                            "{item.prompt}"
                        </p>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{item.resolution}</span>
                            <button 
                                onClick={() => handleCopyPrompt(item.id, item.prompt)}
                                className="text-[10px] font-bold text-purple-400 hover:text-white transition-colors"
                            >
                                {copiedId === item.id ? "COPIED" : "COPY PROMPT"}
                            </button>
                        </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* LIGHTBOX MODAL (Premium Blur) */}
      {selectedImage && (
        <div className="fixed inset-0 z-1000 flex items-center justify-center p-4 md:p-10">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setSelectedImage(null)} />
          
          <div className="relative z-10 w-full max-w-5xl flex flex-col items-center animate-in zoom-in duration-300">
            <button onClick={() => setSelectedImage(null)} className="absolute -top-12 right-0 md:-right-12 text-white/50 hover:text-white transition-colors">
              <X size={32} />
            </button>
            
            <div className="relative group rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <img src={selectedImage.url} alt="Full" className="max-h-[70vh] w-auto object-contain" />
                <div className="absolute bottom-0 inset-x-0 p-8 bg-linear-to-t from-black/80 to-transparent">
                    <p className="text-white text-lg font-medium text-center max-w-3xl mx-auto leading-relaxed">
                        {selectedImage.prompt}
                    </p>
                </div>
            </div>

            <div className="mt-8 flex gap-4">
                <button onClick={() => downloadImage(selectedImage.url)} className="px-8 py-3 rounded-2xl bg-white text-black font-bold flex items-center gap-2 hover:bg-purple-50 transition-all">
                    <Download size={20} /> Save Image
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}