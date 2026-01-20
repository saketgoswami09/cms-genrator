import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "../../../services/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

/* ---------------- Schema ---------------- */

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const LoginForm = ({ cardRef }) => {
  const navigate = useNavigate();
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

  const submitHandler = async (data) => {
    setIsSubmitting(true);

    try {
      const res = await signIn(data);
      

      localStorage.setItem("token", res.data.token);
      toast.success("Welcome back!");
      // reset();
      // navigate("/");
    } catch (error) {
      const message =
        error.response?.data?.message ??
        "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const labelStyle = "mb-1 block text-sm font-medium text-gray-700";
  const inputStyle =
    "w-full rounded-xl border border-gray-300 px-4 py-3 text-sm " +
    "focus:border-blue-300 focus:ring-1 focus:ring-blue-900 outline-none transition-all";

  return (
    <div className="flex items-center justify-center bg-gray-50 px-4">
      <div
        ref={cardRef}
        className="login-card w-full max-w-md rounded-2xl bg-white p-8
        shadow-[0_20px_40px_-20px_rgba(0,0,0,0.15)]"
      >
        <div className="login-header mb-8">
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-500">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
          <div className="login-field">
            <label className={labelStyle}>Email</label>
            <input
              {...register("email")}
              placeholder="you@example.com"
              className={inputStyle}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="login-field">
            <label className={labelStyle}>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="••••••••"
              className={inputStyle}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="
              login-button w-full rounded-xl
              bg-gradient-to-r
              from-[hsl(220,75%,60%)]
              via-[hsl(260,75%,60%)]
              to-[hsl(310,70%,65%)]
              py-3 text-sm font-medium text-white
              shadow-lg shadow-purple-500/30
              
              hover:brightness-110 active:scale-[0.97]
              disabled:opacity-70
            "
          >
            {isSubmitting ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="font-medium text-blue-900 hover:underline cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
