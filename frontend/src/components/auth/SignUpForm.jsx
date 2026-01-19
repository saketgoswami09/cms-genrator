import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signUp } from "../../../services/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  name: z.string().min(2, "Name must be atleast 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain 1 uppercase letter")
    .regex(/[a-z]/, "Password must contain 1 lowercase letter")
    .regex(/[0-9]/, "Password must contain 1 number")
    .regex(/[^A-Za-z0-9]/, "Password must contain 1 special character"),
});

const SignUpForm = ({ cardRef }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Fixed typo

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
      await signUp(data);
      toast.success("Account created successfully! Please login."); // Fixed typo
      reset();
      navigate("/login");
    } catch (error) {
      console.error(`Error in signing up user: ${error}`);
      toast.error("Sign up failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const labelStyle = "mb-1 block text-sm font-medium text-gray-700";
  const inputStyle = "w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-300 focus:ring-1 focus:ring-blue-900 outline-none transition-all";

  return (
    <div className="flex items-center justify-center bg-gray-50 px-4">
      <div
        ref={cardRef}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.15)]"
      >
        <div className="signup-header mb-8">
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900">
            Create account
          </h2>
          <p className="mt-2 text-sm text-gray-500">Sign up to get started</p>
        </div>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
          {/* Name */}
          <div className="signup-field">
            <label htmlFor="name" className={labelStyle}>Full name</label>
            <input
              id="name"
              {...register("name")}
              placeholder="John Doe"
              className={inputStyle}
            />
          </div>
          {errors?.name?.message && (
            <p className="mt-1 text-sm text-red-500 font-medium">{errors?.name?.message}</p>
          )}

          {/* Email */}
          <div className="signup-field">
            <label htmlFor="email" className={labelStyle}>Email</label>
            <input
              id="email"
              {...register("email")}
              placeholder="you@example.com"
              className={inputStyle}
            />
          </div>
          {errors?.email?.message && (
            <p className="mt-1 text-sm text-red-500 font-medium">{errors?.email?.message}</p>
          )}

          {/* Password */}
          <div className="signup-field relative">
            <label htmlFor="password" className={labelStyle}>Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="••••••••"
                className={`${inputStyle} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          {errors?.password?.message && (
            <p className="mt-1 text-sm text-red-500 font-medium">{errors?.password?.message}</p>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="signup-button w-full rounded-xl bg-gradient-to-r from-[hsl(220,75%,60%)] via-[hsl(260,75%,60%)] to-[hsl(310,70%,65%)] py-3 text-sm font-medium text-white shadow-lg shadow-purple-500/30 transition-transform duration-300 hover:brightness-110 active:scale-[0.97] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} className="font-medium text-blue-900 hover:underline cursor-pointer">
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;