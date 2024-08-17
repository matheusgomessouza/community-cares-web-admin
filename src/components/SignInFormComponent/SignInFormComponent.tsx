"use client";

import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import * as interfaces from "@/types/interfaces";
import { zodResolver } from "@hookform/resolvers/zod";

export default function SignInFormComponent() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<interfaces.SignInProps>({
    resolver: zodResolver(interfaces.SignInSchema),
  });

  const onSubmit: SubmitHandler<interfaces.SignInProps> = (data) =>
    console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <label htmlFor="" className="text-orange mb-2">
        Username
      </label>
      <input
        type="text"
        {...register("username")}
        className={
          errors.username
            ? "border-solid border-2 h-10 border-gray rounded-lg min-w-60 outline-red-500"
            : "border-solid border-2 h-10 border-gray rounded-lg min-w-60 outline-orange"
        }
      />
      {errors.username && (
        <span className="font-sans font-bold text-red-500">
          {errors.username.message}
        </span>
      )}
      <label htmlFor="" className="text-orange mt-4 mb-2">
        Password
      </label>
      <input
        type="text"
        {...register("password")}
        className={
          errors.password
            ? "border-solid border-2 h-10 rounded-lg min-w-60 border-rose-500"
            : "border-solid border-2 h-10 border-gray rounded-lg min-w-60 outline-orange"
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
