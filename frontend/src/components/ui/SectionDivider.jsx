/**
 * SectionDivider — Horizontal rule with centered label.
 * Used between main content and history sections.
 */
export default function SectionDivider({ icon: Icon, label = "Recent Activity" }) {
  return (
    <div className="relative py-12">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-white/10" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-[#060a13] px-4 text-sm text-white/30 flex items-center gap-2">
          {Icon && <Icon size={16} />}
          {label}
        </span>
      </div>
    </div>
  );
}
