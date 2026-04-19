import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signUp } from "@/services/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Check 
} from "lucide-react";

// --- VALIDATION SCHEMA ---
const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Min 8 characters")
    .regex(/[A-Z]/, "1 uppercase letter")
    .regex(/[a-z]/, "1 lowercase letter")
    .regex(/[0-9]/, "1 number")
    .regex(/[^A-Za-z0-9]/, "1 special char"),
});

// --- PASSWORD REQUIREMENTS LIST ---
const PASS_REQS = [
  { label: "8+ chars", regex: /.{8,}/ },
  { label: "Uppercase", regex: /[A-Z]/ },
  { label: "Lowercase", regex: /[a-z]/ },
  { label: "Number", regex: /[0-9]/ },
  { label: "Special", regex: /[^A-Za-z0-9]/ },
];

const SignUpForm = ({ cardRef }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Protection: If user is already logged in, redirect
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange", 
  });

  const passwordValue = watch("password") || "";

  const submitHandler = async (data) => {
    setIsSubmitting(true);
    try {
      await signUp(data);
      toast.success("Account created! Please log in.");
      reset();
      navigate("/login");
    } catch (error) {
      const message = error.response?.data?.message || "Sign up failed. Try again.";
      toast.error(message);
      console.error("Signup Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // ✨ CHANGED: Removed the outer 'min-h-screen bg-[#0a0a0a]' wrapper.
    // Now returning ONLY the card, allowing the parent (SignUp.jsx) to handle layout.
    <div
      ref={cardRef}
      className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/10 shadow-2xl"
    >
      {/* Header Gradient Accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

      <div className="p-8 md:p-10">
        <div className="mb-8">
          <h2 className="text-3xl font-heading tracking-tight text-white">
            Get Started
          </h2>
          <p className="mt-2 text-sm text-white/40">
            Create your account to unlock full access.
          </p>
        </div>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
          
          {/* NAME INPUT */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 group-focus-within:text-blue-400 transition-colors">
                <User size={18} />
              </div>
              <input
                {...register("name")}
                placeholder="John Doe"
                className="block w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 py-3 text-sm text-white placeholder-white/30 focus:border-blue-500 focus:bg-white/10 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
              />
            </div>
            {errors.name && <p className="text-xs text-red-500 font-medium ml-1">{errors.name.message}</p>}
          </div>

          {/* EMAIL INPUT */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 group-focus-within:text-blue-400 transition-colors">
                <Mail size={18} />
              </div>
              <input
                {...register("email")}
                placeholder="you@example.com"
                className="block w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 py-3 text-sm text-white placeholder-white/30 focus:border-blue-500 focus:bg-white/10 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 font-medium ml-1">{errors.email.message}</p>}
          </div>

          {/* PASSWORD INPUT */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 group-focus-within:text-blue-400 transition-colors">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Create a strong password"
                className="block w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-12 py-3 text-sm text-white placeholder-white/30 focus:border-blue-500 focus:bg-white/10 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/30 hover:text-white/60 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* LIVE PASSWORD STRENGTH METER */}
          <div className="bg-white/5 rounded-xl p-4 grid grid-cols-2 gap-y-2 gap-x-4 border border-white/10">
             {PASS_REQS.map((req, index) => {
               const isValid = req.regex.test(passwordValue);
               return (
                 <div key={index} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all ${isValid ? "bg-green-100" : "bg-gray-200"}`}>
                        {isValid ? (
                           <Check size={10} className="text-green-600" strokeWidth={4} />
                        ) : (
                           <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                        )}
                    </div>
                    <span className={`text-[11px] font-bold transition-colors ${isValid ? "text-green-700" : "text-gray-400"}`}>
                      {req.label}
                    </span>
                 </div>
               )
             })}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:brightness-110 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-xl active:scale-[0.98]"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                Verifying...
              </span>
            ) : (
              <>
                Create Account
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-white/40 font-medium">
          Already have an account?{" "}
          <button 
             onClick={() => navigate("/login")} 
             className="text-blue-400 hover:text-blue-300 font-bold underline-offset-4 hover:underline transition-all"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
