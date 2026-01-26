import React from "react";

/**
 * @param {string} src - The image URL
 * @param {string} title - The title/prompt used for the image
 */
const GalleryItem = ({ src, title }) => {
  return (
    <div className="gallery-item group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-2xl bg-gray-100">
      {/* --- Image Layer --- */}
      <img
        src={src}
        alt={title}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
      />

      {/* --- Overlay Layer --- */}
      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
          <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-1">
            AI Prompt
          </p>
          <span className="text-sm font-medium leading-snug text-white">
            "{title}"
          </span>
        </div>
      </div>
      
      {/* --- Border Glow Effect (Optional) --- */}
      <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-white/20 transition-colors pointer-events-none" />
    </div>
  );
};

export default GalleryItem;