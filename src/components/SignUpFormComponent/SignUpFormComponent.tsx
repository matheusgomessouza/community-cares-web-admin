"use client";

import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

import * as interfaces from "@/types/interfaces";

export default function SignUpFormComponent() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<interfaces.SignUpProps>({
    resolver: zodResolver(interfaces.SignUpSchema),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function postAdminUser(data: interfaces.SignUpProps) {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/admin-users`,
        {
          name: data.name,
          username: data.username,
          email: data.email,
          password: data.password,
        },
      );

      if (response.status === 201)
        toast.success("Admin user successfully created!");
    } catch (error) {
      console.error("Unable to create admin account, please try again.", error);
      toast.error("Unable to create admin account, please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const onSubmit: SubmitHandler<interfaces.SignUpProps> = (data) =>
    postAdminUser(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="John Doe"
            {...register("name")}
            className={`flex h-11 w-full rounded-lg border bg-white px-3 py-2 text-sm transition-all duration-200 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${
              errors.name
                ? "border-red-500 focus-visible:ring-red-500/20 text-red-900 placeholder:text-red-300"
                : "border-gray-200 text-slate-900 hover:border-orange/50 focus-visible:border-orange focus-visible:ring-orange/20"
            }`}
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <div
              className="flex items-center gap-1.5 mt-1.5 text-red-600 text-sm font-medium animate-accordion-down"
              role="alert"
            >
              <AlertCircle className="h-4 w-4" />
              <span>{errors.name.message}</span>
            </div>
          )}
        </div>

        {/* Username */}
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="johndoe"
            {...register("username")}
            className={`flex h-11 w-full rounded-lg border bg-white px-3 py-2 text-sm transition-all duration-200 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${
              errors.username
                ? "border-red-500 focus-visible:ring-red-500/20 text-red-900 placeholder:text-red-300"
                : "border-gray-200 text-slate-900 hover:border-orange/50 focus-visible:border-orange focus-visible:ring-orange/20"
            }`}
            aria-invalid={!!errors.username}
          />
          {errors.username && (
            <div
              className="flex items-center gap-1.5 mt-1.5 text-red-600 text-sm font-medium animate-accordion-down"
              role="alert"
            >
              <AlertCircle className="h-4 w-4" />
              <span>{errors.username.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-700 mb-1.5"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="john@example.com"
          {...register("email")}
          className={`flex h-11 w-full rounded-lg border bg-white px-3 py-2 text-sm transition-all duration-200 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${
            errors.email
              ? "border-red-500 focus-visible:ring-red-500/20 text-red-900 placeholder:text-red-300"
              : "border-gray-200 text-slate-900 hover:border-orange/50 focus-visible:border-orange focus-visible:ring-orange/20"
          }`}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <div
            className="flex items-center gap-1.5 mt-1.5 text-red-600 text-sm font-medium animate-accordion-down"
            role="alert"
          >
            <AlertCircle className="h-4 w-4" />
            <span>{errors.email.message}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
              className={`flex h-11 w-full rounded-lg border bg-white px-3 pr-10 py-2 text-sm transition-all duration-200 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.password
                  ? "border-red-500 focus-visible:ring-red-500/20 text-red-900 placeholder:text-red-300"
                  : "border-gray-200 text-slate-900 hover:border-orange/50 focus-visible:border-orange focus-visible:ring-orange/20"
              }`}
              aria-invalid={!!errors.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none focus:text-orange"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <div
              className="flex items-center gap-1.5 mt-1.5 text-red-600 text-sm font-medium animate-accordion-down"
              role="alert"
            >
              <AlertCircle className="h-4 w-4" />
              <span>{errors.password.message}</span>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("confirmPassword")}
              className={`flex h-11 w-full rounded-lg border bg-white px-3 pr-10 py-2 text-sm transition-all duration-200 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.confirmPassword
                  ? "border-red-500 focus-visible:ring-red-500/20 text-red-900 placeholder:text-red-300"
                  : "border-gray-200 text-slate-900 hover:border-orange/50 focus-visible:border-orange focus-visible:ring-orange/20"
              }`}
              aria-invalid={!!errors.confirmPassword}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none focus:text-orange"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <div
              className="flex items-center gap-1.5 mt-1.5 text-red-600 text-sm font-medium animate-accordion-down"
              role="alert"
            >
              <AlertCircle className="h-4 w-4" />
              <span>{errors.confirmPassword.message}</span>
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 bg-orange hover:bg-[#D97210] active:scale-[0.98] text-white font-bold rounded-lg shadow shadow-orange/20 hover:shadow-orange/40 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
        aria-disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Creating account...</span>
          </>
        ) : (
          <span>Sign up</span>
        )}
      </button>

      <div className="text-center pt-2">
        <p className="text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            href="/"
            className="font-semibold text-orange hover:text-[#D97210] hover:underline transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange/50 rounded px-1"
          >
            Sign in
          </Link>
        </p>
      </div>

      <ToastContainer />
    </form>
  );
}
