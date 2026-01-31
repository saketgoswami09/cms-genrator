import React, { useState } from "react";
import { Upload, FileText, Loader2, Sparkles, RefreshCcw } from "lucide-react";
import { toast } from "react-toastify";
import { analyzeResume } from "../../services/resume"; // Import service
import { ResumeResult } from "../components/ResumeResult";

export default function ResumeRater() {
  const [file, setFile] = useState(null);
  const [role, setRole] = useState("Software Developer");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile?.type !== "application/pdf") {
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
      // Using the service instead of direct axios
      const res = await analyzeResume(formData);
      setResult(res.data.data);
      toast.success("Analysis complete!");
    } catch (error) {
      const msg = error.response?.data?.message || "Analysis failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-xs font-bold mb-4 border border-purple-100 uppercase tracking-widest">
          <Sparkles size={14} /> ATS Optimizer
        </div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
          Resume <span className="text-purple-600">Rater</span>
        </h1>
      </div>

      {!result ? (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">Target Job Role</label>
            <input 
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-purple-500/20 text-gray-800 font-medium outline-none transition-all"
              placeholder="e.g. Full Stack Developer"
            />
          </div>

          <div className="relative group">
            <input 
              type="file" 
              onChange={handleFileChange} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              accept=".pdf"
            />
            <div className={`p-12 rounded-[2.5rem] border-2 border-dashed transition-all duration-300 ${
              file ? "border-purple-500 bg-purple-50/30" : "border-gray-200 bg-white group-hover:border-purple-300"
            } flex flex-col items-center justify-center text-center`}>
              <div className={`size-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
                file ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-400 group-hover:bg-purple-100 group-hover:text-purple-600"
              }`}>
                {file ? <FileText size={32} /> : <Upload size={32} />}
              </div>
              <h3 className="font-bold text-gray-900">{file ? file.name : "Upload Resume (PDF)"}</h3>
              <p className="text-sm text-gray-400 mt-1">Drag and drop or click to browse</p>
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || !file}
            className="w-full h-14 rounded-2xl bg-gray-900 text-white font-bold flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? <><Loader2 className="animate-spin" /> Analyzing...</> : "Start AI Analysis"}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <ResumeResult result={result} />
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 mx-auto text-sm font-bold text-gray-400 hover:text-purple-600 transition-colors"
          >
            <RefreshCcw size={16} /> Re-upload another resume
          </button>
        </div>
      )}
    </div>
  );
}