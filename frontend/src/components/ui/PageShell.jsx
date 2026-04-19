/**
 * PageShell — Standard page wrapper with dark background + dot-grid pattern.
 * Replaces the duplicated pattern across GenerateContent, GenerateImage, Content, Image, etc.
 */
export default function PageShell({ children, className = "" }) {
  return (
    <div className={`min-h-screen bg-[#060a13] text-white font-sans relative overflow-hidden ${className}`}>
      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
