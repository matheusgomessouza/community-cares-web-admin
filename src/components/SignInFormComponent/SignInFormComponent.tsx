"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

import * as interfaces from "@/types/interfaces";

export default function SignInFormComponent() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<interfaces.SignInProps>({
    resolver: zodResolver(interfaces.SignInSchema),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  async function handleAdminAuth(data: interfaces.SignInProps) {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/admin-users/authenticate`,
        {
          username: data.username,
          password: data.password,
        },
      );

      if (response.status === 200) {
        document.cookie = `token=${response.data.token}; Secure`;
        router.push("/validate");
      }
    } catch (error) {
      console.error("Unable to perform authentication, try again.", error);
    } finally {
      setIsLoading(false);
    }
  }

  const onSubmit: SubmitHandler<interfaces.SignInProps> = (data) =>
    handleAdminAuth(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        {/* Username */}
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Username
          </label>
          <div className="relative">
            <input
              id="username"
              type="text"
              className={`flex h-11 w-full rounded-lg border bg-white px-3 py-2 text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.username
                  ? "border-red-500 focus-visible:ring-red-500/20 text-red-900 placeholder:text-red-300"
                  : "border-gray-200 text-slate-900 hover:border-orange/50 focus-visible:border-orange focus-visible:ring-orange/20"
              }`}
              placeholder="Enter your username"
              {...register("username")}
              aria-invalid={!!errors.username}
            />
          </div>
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
              className={`flex h-11 w-full rounded-lg border bg-white px-3 pr-10 py-2 text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.password
                  ? "border-red-500 focus-visible:ring-red-500/20 text-red-900 placeholder:text-red-300"
                  : "border-gray-200 text-slate-900 hover:border-orange/50 focus-visible:border-orange focus-visible:ring-orange/20"
              }`}
              placeholder="••••••••"
              {...register("password")}
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

        {/* Forgot Password Link */}
        <div className="flex justify-end">
          <Link
            href="#"
            className="text-sm font-medium text-orange hover:text-[#D97210] hover:underline transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange/50 rounded"
          >
            Forgot password?
          </Link>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 bg-orange hover:bg-[#D97210] active:scale-[0.98] text-white font-bold rounded-lg shadow shadow-orange/20 hover:shadow-orange/40 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
        aria-disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Authenticating...</span>
          </>
        ) : (
          <span>Sign in</span>
        )}
      </button>

      {/* Sign Up Link */}
      <div className="text-center pt-2">
        <p className="text-sm text-slate-500">
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-orange hover:text-[#D97210] hover:underline transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange/50 rounded px-1"
          >
            Sign up
          </Link>
        </p>
      </div>
    </form>
  );
}
