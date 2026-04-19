import { useState, useRef, useLayoutEffect } from "react";
import { Upload, FileText, Sparkles, RefreshCcw } from "lucide-react";
import { toast } from "react-toastify";
import gsap from "gsap";
import { analyzeResume } from "@/services/resume";
import { ResumeResult } from "@/components/ResumeResult";
import ScanningLoader from "@/components/ui/ScanningLoader";

export default function ResumeRater() {
  const [file, setFile] = useState(null);
  const [role, setRole] = useState("Software Developer");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  // 1. Added ref to manage the physical file input element
  const fileInputRef = useRef(null);
  const pageRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".resume-badge", { y: 20, opacity: 0, duration: 0.6 });
      tl.from(".resume-title", { y: 30, opacity: 0, duration: 0.8 }, "-=0.4");
      tl.from(".resume-form", { y: 40, opacity: 0, duration: 0.7 }, "-=0.4");
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile?.type !== "application/pdf") {
      // If invalid, clear the input so they can try again immediately
      if (fileInputRef.current) fileInputRef.current.value = "";
      return toast.error("Please upload a PDF file");
    }
    setFile(selectedFile);
  };

  const handleAnalyze = async () => {
    if (!file) return toast.warn("Please select a resume first");

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("role", role);

    try {
      const res = await analyzeResume(formData);
      setResult(res.data.data);
      toast.success("Analysis complete!");
    } catch (error) {
      // 3. Improved error logging and fallback message
      console.error("Analysis Error:", error);
      const msg = error.response?.data?.message || "Analysis failed. Please check your connection.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    // 1. Clear the physical file input so the exact same file can be re-uploaded if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div ref={pageRef} className="max-w-4xl mx-auto py-12 px-4 min-h-screen">
      {/* HEADER */}
      {!loading && (
        <div className="text-center mb-12">
          <div className="resume-badge inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold mb-4 uppercase tracking-widest">
            <Sparkles size={14} /> ATS Optimizer
          </div>
          <h1 className="resume-title text-4xl font-black text-white tracking-tight">
            Resume <span className="text-purple-400">Rater</span>
          </h1>
        </div>
      )}

      {/* LOGIC FLOW */}
      {result ? (
        <div className="space-y-6">
          <ResumeResult result={result} />
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 mx-auto text-sm font-bold text-white/30 hover:text-purple-400 transition-colors"
          >
            <RefreshCcw size={16} /> Re-upload another resume
          </button>
        </div>
      ) : loading ? (
        <div className="animate-in fade-in zoom-in duration-500">
           <ScanningLoader />
        </div>
      ) : (
        // 2. Converted to a <form> for accessibility and "Enter" key submission
        <form 
          onSubmit={(e) => { 
            e.preventDefault(); 
            handleAnalyze(); 
          }} 
          className="resume-form space-y-6"
        >
          <div className="bg-white/[0.04] backdrop-blur-sm rounded-3xl p-6 border border-white/10">
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3 block">Target Job Role</label>
            <input 
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-5 py-3 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-purple-500/20 text-white font-medium outline-none transition-all placeholder:text-white/30"
              placeholder="e.g. Full Stack Developer"
            />
          </div>

          <div className="relative group">
            <input 
              type="file" 
              ref={fileInputRef} // <-- Attached ref here
              onChange={handleFileChange} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              accept=".pdf"
            />
            <div className={`p-12 rounded-[2.5rem] border-2 border-dashed transition-all duration-300 ${
              file ? "border-purple-500 bg-purple-500/10" : "border-white/10 bg-white/[0.02] group-hover:border-purple-500/30"
            } flex flex-col items-center justify-center text-center`}>
              <div className={`size-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
                file ? "bg-purple-600 text-white" : "bg-white/5 text-white/30 group-hover:bg-purple-500/10 group-hover:text-purple-400"
              }`}>
                {file ? <FileText size={32} /> : <Upload size={32} />}
              </div>
              <h3 className="font-bold text-white">{file ? file.name : "Upload Resume (PDF)"}</h3>
              <p className="text-sm text-white/30 mt-1">Drag and drop or click to browse</p>
            </div>
          </div>

          <button
            type="submit" // <-- Changed to type="submit"
            disabled={!file}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            Start AI Analysis
          </button>
        </form>
      )}
    </div>
  );
}
