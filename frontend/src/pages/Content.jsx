import Card from "../components/Card";
import { 
  FileText, 
  Maximize2, 
  Minimize2, 
  Search, 
  PenTool, 
  History, 
  Sparkles 
} from "lucide-react";

const contentFeatures = [
  {
    id: "rewrite",
    link: "/content/rewrite",
    title: "Rewrite Content",
    description: "Refine grammar and flow while keeping your original meaning.",
    icon: <FileText className="w-6 h-6" />,
    gradient: "from-blue-600 to-cyan-500",
  },
  {
    id: "expand",
    link: "/content/expand",
    title: "Expand Content",
    description: "Add depth and detail to brief notes or short paragraphs.",
    icon: <Maximize2 className="w-6 h-6" />,
    gradient: "from-indigo-600 to-purple-500",
  },
  {
    id: "shorten",
    link: "/content/shorten",
    title: "Shorten Content",
    description: "Summarize long articles into concise, punchy sentences.",
    icon: <Minimize2 className="w-6 h-6" />,
    gradient: "from-orange-500 to-amber-400",
  },
  {
    id: "seo-content",
    link: "/content/seo-content",
    title: "SEO Optimizer",
    description: "Generate meta tags, keywords, and titles for better ranking.",
    icon: <Search className="w-6 h-6" />,
    gradient: "from-cyan-500 to-teal-500",
  },
  {
    id: "generate-article",
    link: "/content/generate-article",
    title: "Article Writer",
    description: "Create full-length, structured articles from a simple topic.",
    icon: <PenTool className="w-6 h-6" />,
    gradient: "from-green-600 to-emerald-500",
    badge: "New"
  },
  {
    id: "history",
    link: "/content/history",
    title: "Output Vault",
    description: "Access and manage all your previously generated text.",
    icon: <History className="w-6 h-6" />,
    gradient: "from-purple-500 to-pink-500",
  },
];

export default function Content() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] relative overflow-hidden">
      {/* 🧬 Background Mesh (Subtle UI Touch) */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-50 rounded-full blur-[120px] -z-10 opacity-60" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[120px] -z-10 opacity-60" />

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        {/* HEADER SECTION */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100 uppercase tracking-widest">
            <Sparkles size={14} /> AI Writing Assistant
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight">
            Content <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">Engine</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            From quick rewrites to full-length articles, leverage our advanced 
            language models to perfect your copy.
          </p>
        </div>

        {/* DYNAMIC GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {contentFeatures.map((feature) => (
            <Card key={feature.id} feature={feature} />
          ))}
        </div>

        {/* INFO FOOTER SECTION */}
        <div className="mt-24 relative overflow-hidden rounded-[2rem] bg-gray-900 p-8 md:p-12 text-white">
          <div className="absolute top-0 right-0 -m-12 opacity-10">
            <FileText size={300} />
          </div>
          
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Precision Editing. <br/> Infinite Possibilities.</h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                Our content tools don't just replace words; they understand 
                context, intent, and tone to ensure your voice remains authentic 
                while becoming more professional.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
               {[
                 { label: "Grammar Check", color: "bg-blue-500" },
                 { label: "Plagiarism Safe", color: "bg-purple-500" },
                 { label: "Tone Control", color: "bg-orange-500" },
                 { label: "Instant Export", color: "bg-green-500" }
               ].map((tag, i) => (
                 <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 p-4 rounded-xl">
                   <div className={`w-2 h-2 rounded-full ${tag.color}`} />
                   <span className="text-sm font-medium">{tag.label}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}