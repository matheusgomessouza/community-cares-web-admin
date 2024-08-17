"use client";

import axios from "axios";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import * as interfaces from "@/types/interfaces";

export default function SignUpFormComponent() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<interfaces.SignUpProps>({
    resolver: zodResolver(interfaces.SignUpSchema),
  });

  async function postAdminUser(data: interfaces.SignUpProps) {
    await axios.post("https://community-cares-server.onrender.com/admin-user", {
      name: data.name,
      username: data.username,
      email: data.email,
      password: data.password,
    });
  }

  const onSubmit: SubmitHandler<interfaces.SignUpProps> = (data) =>
    postAdminUser(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-8 justify-center"
    >
      <section className="flex flex-col xl:flex-row gap-9 min-w-full">
        <div className="flex flex-col">
          <label htmlFor="" className="text-orange mb-2">
            Name
          </label>
          <input
            type="text"
            {...register("name")}
            className={
              errors.name
                ? "border-solid border-2 h-10 border-gray rounded-lg min-w-60 outline-red-500"
                : "border-solid border-2 h-10 border-gray rounded-lg min-w-60 outline-orange"
            }
          />
        </div>
        <div className="flex flex-col">
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
        </div>
      </section>

      <div className="flex flex-col">
        <label htmlFor="" className="text-orange mb-2">
          Email
        </label>
        <input
          type="email"
          {...register("email")}
          className={
            errors.email
              ? "border-solid border-2 h-10 border-gray rounded-lg min-w-60 outline-red-500"
              : "border-solid border-2 h-10 border-gray rounded-lg min-w-60 outline-orange"
          }
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="" className="text-orange mb-2">
          Password
        </label>
        <input
          type="text"
          {...register("password")}
          className={
            errors.password
              ? "border-solid border-2 h-10 border-gray rounded-lg min-w-60 outline-red-500"
              : "border-solid border-2 h-10 border-gray rounded-lg min-w-60 outline-orange"
          }
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="" className="text-orange mb-2">
          Confirm password
        </label>
        <input
          type="text"
          {...register("confirmPassword")}
          className={
            errors.confirmPassword
              ? "border-solid border-2 h-10 border-gray rounded-lg min-w-60 outline-red-500"
              : "border-solid border-2 h-10 border-gray rounded-lg min-w-60 outline-orange"
          }
        />
      </div>

      <button
        type="submit"
        className="bg-orange h-10 rounded-lg mt-8 max-w-60 min-w-60 mx-auto"
      >
        <span className="font-bold font">Sign up</span>
      </button>
      <p className="text-gray mt-4 text-center">
        Already have an account?{" "}
        <Link href="/" className="cursor-pointer">
          <u className="text-orange">Sign in</u>
        </Link>
      </p>
    </form>
  );
}
