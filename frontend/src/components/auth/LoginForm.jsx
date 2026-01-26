import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "../../../services/auth";
import { toast } from "react-toastify";
import {  useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { Eye, EyeOff, Mail, Lock } from "lucide-react"; // Icons for better UI

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const LoginForm = ({ cardRef }) => {
  const navigate = useNavigate();
  // ✅ Fixed: Added parentheses to call the hook
  const { login, isAuthenticated } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);
  const submitHandler = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await signIn(data);

      const token = res.data.token;
      const userName = res.data.user.name;

      // ✅ Global State update
      login(token, userName);

      toast.success(`Welcome back, ${userName}!`);
      reset();
      navigate("/");
    } catch (error) {
      const message =
        error.response?.data?.message ?? "Invalid email or password.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-[#0a0a0a] px-4 min-h-screen relative overflow-hidden">
      {/* Optional: Background logic matches your theme */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      ></div>

      <div
        ref={cardRef}
        className="relative w-full max-w-md rounded-3xl bg-white p-8 md:p-10 shadow-2xl"
      >
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-gray-500">
            Sign in to continue your creative journey.
          </p>
        </div>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
          {/* EMAIL */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 ml-1">
              Email
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 group-focus-within:text-blue-600 transition-colors">
                <Mail size={18} />
              </div>
              <input
                {...register("email")}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-11 pr-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 ml-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 ml-1">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 group-focus-within:text-blue-600 transition-colors">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-11 pr-12 py-3 text-sm focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 ml-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-gray-900 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-black transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Logging in...
              </span>
            ) : (
              "Log in"
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          New here?{" "}
          <span
            onClick={() => navigate("/register")}
            className="font-bold text-blue-600 hover:underline cursor-pointer transition-all"
          >
            Create an account
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
