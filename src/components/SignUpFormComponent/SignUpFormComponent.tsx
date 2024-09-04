"use client";

import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
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

  async function postAdminUser(data: interfaces.SignUpProps) {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "https://community-cares-server.onrender.com/admin-user",
        {
          name: data.name,
          username: data.username,
          email: data.email,
          password: data.password,
        }
      );

      if (response.status === 201)
        toast.success("Admin user successfully created!");
    } catch (error) {
      setIsLoading(false);
      console.error("Unable to create admin account, please try again.", error);
      toast.error("Unable to create admin account, please try again.");
    } finally {
      setIsLoading(false);
    }
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
                ? "px-2 border-solid border-2 h-10 rounded-lg min-w-60 border-rose-500 outline-red-500"
                : "px-2 border-solid border-2 h-10 border-gray rounded-lg min-w-60 outline-orange"
            }
          />
          {errors.name && (
            <span className="font-sans font-bold text-red-500">
              {errors.name.message}
            </span>
          )}
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
                ? "px-2 border-solid border-2 h-10 rounded-lg min-w-60 border-rose-500 outline-red-500"
                : "px-2 border-solid border-2 h-10 border-gray rounded-lg min-w-60 outline-orange"
            }
          />
          {errors.username && (
            <span className="font-sans font-bold text-red-500">
              {errors.username.message}
            </span>
          )}
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
              ? "px-2 border-solid border-2 h-10 rounded-lg min-w-60 border-rose-500 outline-red-500"
              : "px-2 border-solid border-2 h-10 border-gray rounded-lg min-w-60 outline-orange"
          }
        />
        {errors.email && (
          <span className="font-sans font-bold text-red-500">
            {errors.email.message}
          </span>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="password" className="text-orange mb-2">
          Password
        </label>
        <input
          type="password"
          {...register("password")}
          className={
            errors.password
              ? "px-2 border-solid border-2 h-10 rounded-lg min-w-60 border-rose-500 outline-red-500"
              : "px-2 border-solid border-2 h-10 border-gray rounded-lg min-w-60 outline-orange"
          }
        />
        {errors.password && (
          <span className="font-sans font-bold text-red-500">
            {errors.password.message}
          </span>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="" className="text-orange mb-2">
          Confirm password
        </label>
        <input
          type="password"
          {...register("confirmPassword")}
          className={
            errors.confirmPassword
              ? "px-2 border-solid border-2 h-10 rounded-lg min-w-60 border-rose-500 outline-red-500"
              : "px-2 border-solid border-2 h-10 border-gray rounded-lg min-w-60 outline-orange"
          }
        />
        {errors.confirmPassword && (
          <span className="font-sans font-bold text-red-500">
            {errors.confirmPassword.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        className="bg-orange h-10 rounded-lg mt-8 max-w-60 min-w-60 mx-auto"
      >
        {isLoading ? (
          <section className="flex gap-2 items-center justify-center">
            <p className="font-semibold text-white">Creating user</p>
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
          <span className="font-bold font">Sign up</span>
        )}
      </button>
      <p className="text-gray mt-4 text-center">
        Already have an account?{" "}
        <Link href="/" className="cursor-pointer">
          <u className="text-orange">Sign in</u>
        </Link>
      </p>

      <ToastContainer />
    </form>
  );
}
