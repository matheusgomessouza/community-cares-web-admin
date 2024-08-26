"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import * as interfaces from "@/types/interfaces";
import { useState } from "react";

export default function SignInFormComponent() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<interfaces.SignInProps>({
    resolver: zodResolver(interfaces.SignInSchema),
  });
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  async function handleAdminAuth(data: interfaces.SignInProps) {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "https://community-cares-server.onrender.com/authenticate-admin",
        {
          username: data.username,
          password: data.password,
        }
      );

      if (response.status === 200) {
        document.cookie = `token=${response.data.token}; Secure`;
        router.push("/validate");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Unable to perform authentication, try again.", error);
    } finally {
      setIsLoading(false);
    }
  }

  const onSubmit: SubmitHandler<interfaces.SignInProps> = (data) =>
    handleAdminAuth(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <label htmlFor="username" className="text-orange mb-2">
        Username
      </label>
      <input
        type="text"
        title="Username form field"
        placeholder=""
        {...register("username")}
        className={
          errors.username
            ? "px-2 border-solid border-2 h-10 rounded-lg min-w-60 border-rose-500 focus-visible:outline-red-500"
            : "px-2 border-solid border-2 h-10 border-gray rounded-lg min-w-60 outline-orange"
        }
      />
      {errors.username && (
        <span className="font-sans font-bold text-red-500">
          {errors.username.message}
        </span>
      )}
      <label htmlFor="password" className="text-orange mt-4 mb-2">
        Password
      </label>
      <input
        type="password"
        title="Password form field"
        placeholder=""
        {...register("password")}
        className={
          errors.password
            ? "px-2 border-solid border-2 h-10 rounded-lg min-w-60 border-rose-500 focus-visible:outline-red-500"
            : "px-2 border-solid border-2 h-10 border-gray rounded-lg min-w-60 outline-orange"
        }
      />
      {errors.password && (
        <span className="font-sans font-bold text-red-500">
          {errors.password.message}
        </span>
      )}
      <Link href="#" className="text-orange text-xs font-bold mt-2">
        <u>Forgot password?</u>
      </Link>
      <button type="submit" className="bg-orange h-10 rounded-lg mt-8">
        {isLoading ? (
          <section className="flex gap-2 items-center justify-center">
            <p className="font-semibold text-white">Authenticating</p>
            <svg
              width="100"
              height="100"
              className="animate-spin h-5 w-5 mr-3 border-white rounded-full border-4 border-dotted"
            >
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="green"
                strokeWidth="4"
                fill="yellow"
              />
            </svg>
          </section>
        ) : (
          <span className="font-bold font">Sign in</span>
        )}
      </button>
      <p className="text-gray mt-4">
        Don’t have an account?{" "}
        <Link href="/register" className="cursor-pointer">
          <u className="text-orange">Sign up</u>
        </Link>
      </p>
    </form>
  );
}
