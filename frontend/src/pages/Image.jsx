import Card from "../components/Card";
import { Image as ImageIcon, History as ListIcon, Sparkles } from "lucide-react"; // Using Lucide for cleaner icons

const imageFeature = [
  {
    id: "generate",
    link: "/image/generate",
    title: "Generate Image",
    description: "Transform your text prompts into high-quality AI visuals instantly.",
    icon: <ImageIcon className="w-6 h-6" />,
    gradient: "from-blue-600 to-cyan-500",
    badge: "Popular"
  },
  {
    id: "history",
    link: "/image/history",
    title: "Image History",
    description: "Access your past creations, re-download, or refine your previous work.",
    icon: <ListIcon className="w-6 h-6" />,
    gradient: "from-purple-600 to-pink-500",
  },
];

export default function Image() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] relative overflow-hidden">
      {/* 🌌 Background Decorative Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100/50 rounded-full blur-3xl -z-10" />

      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        {/* HEADER */}
        <div className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold mb-4 border border-blue-100">
            <Sparkles size={14} /> AI Visual Suite
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            Image <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Studio</span>
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            Create stunning visuals from simple text descriptions and manage your 
            entire creative gallery in one powerful workspace.
          </p>
        </div>

        {/* FEATURE GRID */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {imageFeature.map((feature) => (
            <Card key={feature.id} feature={feature} />
          ))}
        </div>

        {/* ABOUT SECTION (Re-designed as a sleek banner) */}
        <div className="relative group overflow-hidden rounded-3xl bg-white border border-gray-100 p-8 md:p-12 shadow-xl shadow-gray-200/50 transition-all hover:shadow-2xl">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <ImageIcon size={120} />
          </div>
          
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              Powerful Image Tools at your fingertips
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Our studio uses the latest Diffusion models to ensure your images are 
              photorealistic and sharp. Whether you are building a website, social 
              content, or digital art, the Studio handles the complexity so you 
              can focus on the vision.
            </p>
            <div className="mt-8 flex gap-6 text-sm font-semibold text-gray-400">
               <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> High Resolution
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Fast Generation
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}