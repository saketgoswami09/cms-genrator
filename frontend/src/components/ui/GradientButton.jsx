import { RefreshCw } from "lucide-react";

/**
 * GradientButton — Reusable gradient submit button with loading state.
 * Replaces the identical submit button pattern in GenerateContent, GenerateImage, LoginForm, SignUpForm.
 */
export default function GradientButton({
  children,
  loading = false,
  loadingText = "Processing...",
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <button
      disabled={loading || disabled}
      className={`w-full relative flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <RefreshCw className="animate-spin" size={18} />
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
