import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signUp } from "../../../services/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Check, 
  X 
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
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange", // Validates as you type
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
      console.error(error);
      toast.error("Sign up failed. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB] px-4 font-sans relative overflow-hidden">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.4]" 
           style={{ backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      <div
        ref={cardRef}
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl shadow-gray-200/50 ring-1 ring-gray-100"
      >
        {/* Header with decorative gradient line */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

        <div className="p-8 md:p-10">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Get Started
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Create your account to unlock full access.
            </p>
          </div>

          <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
            
            {/* NAME INPUT */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                  <User size={18} />
                </div>
                <input
                  {...register("name")}
                  placeholder="John Doe"
                  className="block w-full rounded-xl border border-gray-200 bg-gray-50/30 pl-11 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                />
              </div>
              {errors.name && <p className="text-xs text-red-500 font-medium ml-1">{errors.name.message}</p>}
            </div>

            {/* EMAIL INPUT */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  {...register("email")}
                  placeholder="you@example.com"
                  className="block w-full rounded-xl border border-gray-200 bg-gray-50/30 pl-11 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 font-medium ml-1">{errors.email.message}</p>}
            </div>

            {/* PASSWORD INPUT */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Create a strong password"
                  className="block w-full rounded-xl border border-gray-200 bg-gray-50/30 pl-11 pr-12 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* LIVE PASSWORD STRENGTH METER */}
            <div className="bg-gray-50 rounded-xl p-3 grid grid-cols-2 gap-2 border border-gray-100">
               {PASS_REQS.map((req, index) => {
                 const isValid = req.regex.test(passwordValue);
                 return (
                   <div key={index} className="flex items-center gap-2">
                      {isValid ? (
                        <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                           <Check size={10} className="text-green-600" strokeWidth={3} />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                           <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                        </div>
                      )}
                      <span className={`text-[11px] font-medium transition-colors ${isValid ? "text-green-700" : "text-gray-400"}`}>
                        {req.label}
                      </span>
                   </div>
                 )
               })}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-gray-900/20 active:scale-[0.98]"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <button 
                onClick={() => navigate("/login")} 
                className="font-semibold text-blue-600 hover:text-blue-500 hover:underline transition-all"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;