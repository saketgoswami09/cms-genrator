/**
 * GlassCard — Reusable dark glassmorphism container.
 * Eliminates the repeated `bg-white/[0.04] backdrop-blur-sm ring-1 ring-white/10` pattern.
 */
export default function GlassCard({ children, className = "", active = false, ...props }) {
  return (
    <div
      className={`rounded-2xl bg-white/[0.04] backdrop-blur-sm shadow-xl ring-1 ring-white/10 overflow-hidden transition-all duration-500 ${
        active ? "ring-2 ring-purple-500/30" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
