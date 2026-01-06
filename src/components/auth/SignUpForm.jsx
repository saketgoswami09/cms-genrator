import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
const schema = z.object({
  name: z.string().min(2, "Name must be atleast 2 charchter"),
  email: z.string().email("Enter a vaild email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain 1 uppercase letter")
    .regex(/[a-z]/, "Password must contain 1 lowercase letter")
    .regex(/[0-9]/, "Password must contain 1 number")
    .regex(/[^A-Za-z0-9]/, "Password must contain 1 special character"),
});
// We accept cardRef so the parent animation hook can lift this card
const SignUpForm = ({ cardRef }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
  console.log(errors);

  const submitHandler = (data) => {
    console.log(data);
  };

  // Shared Styles
  const labelStyle = "mb-1 block text-sm font-medium text-gray-700";
  const inputStyle =
    "w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-300 focus:ring-1 focus:ring-blue-900 outline-none transition-all";

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
            <label htmlFor="name" className={labelStyle}>
              Full name
            </label>
            <input
              id="name"
              {...register("name")}
              placeholder="John Doe"
              className={inputStyle}
            />
          </div>
          {errors?.name?.message && (
            <p className="mt-1 text-sm text-red-500 font-medium">
              {errors?.name?.message}
            </p>
          )}
          {/* Email */}
          <div className="signup-field">
            <label htmlFor="email" className={labelStyle}>
              Email
            </label>
            <input
              id="email"
              {...register("email")}
              placeholder="you@example.com"
              className={inputStyle}
            />
          </div>
          {errors?.email?.message && (
            <p className="mt-1 text-sm text-red-500 font-medium">
              {errors?.email?.message}
            </p>
          )}
          {/* Password */}
          <div className="signup-field">
            <label htmlFor="password" className={labelStyle}>
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              placeholder="••••••••"
              className={inputStyle}
            />
          </div>
          {errors?.password?.message && (
            <p className="mt-1 text-sm text-red-500 font-medium">
              {errors?.password?.message}
            </p>
          )}
          {/* Gradient Button */}
          <button
            type="submit"
            className="signup-button w-full rounded-xl 
              bg-gradient-to-r from-[hsl(220,75%,60%)] via-[hsl(260,75%,60%)] to-[hsl(310,70%,65%)]
              py-3 text-sm font-medium text-white shadow-lg shadow-purple-500/30 
            transition-transform duration-300 hover:brightness-110 active:scale-[0.97]
 "
          >
            Create account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <span className="font-medium text-blue-900 hover:underline cursor-pointer">
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
