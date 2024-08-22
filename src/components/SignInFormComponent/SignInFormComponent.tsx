"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import * as interfaces from "@/types/interfaces";

export default function SignInFormComponent() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<interfaces.SignInProps>({
    resolver: zodResolver(interfaces.SignInSchema),
  });

  const router = useRouter();

  async function handleAdminAuth(data: interfaces.SignInProps) {
    try {
      const response = await axios.post(
        "http://localhost:8080/authenticate-admin",
        {
          username: data.username,
          password: data.password,
        },
        {
          proxy: {
            protocol: "http",
            host: "185.153.176.137",
            port: 8080,
          },
        }
      );

      if (response.status === 200) {
        document.cookie  = `token=${response.data.token}; Secure`
        router.push("/validate");
      }
    } catch (error) {
      console.error("Unable to perform authentication, try again.", error);
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
            ? "border-solid border-2 h-10 rounded-lg min-w-60 border-rose-500 px-1 focus-visible:outline-red-500"
            : "border-solid border-2 h-10 border-gray rounded-lg min-w-60 outline-orange px-1"
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
            ? "border-solid border-2 h-10 rounded-lg min-w-60 border-rose-500 px-1 focus-visible:outline-red-500"
            : "border-solid border-2 h-10 border-gray rounded-lg min-w-60 outline-orange px-1"
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
        <span className="font-bold font">Sign in</span>
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
