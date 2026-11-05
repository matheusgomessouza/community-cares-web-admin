"use client";

import axios, { type AxiosError } from "axios";
import Link from "next/link";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import * as interfaces from "@/types/interfaces";

const SUCCESS_MESSAGE =
	"If an account exists for this email, a reset link has been sent.";

type Feedback = {
	kind: "success" | "error";
	message: string;
};

export default function ForgotPasswordFormComponent() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<interfaces.ForgotPasswordProps>({
		resolver: zodResolver(interfaces.ForgotPasswordSchema),
	});
	const [feedback, setFeedback] = useState<Feedback | null>(null);

	const requestMutation = useMutation({
		mutationFn: async (data: interfaces.ForgotPasswordProps) => {
			return axios.post(
				`${process.env.NEXT_PUBLIC_API}/admin-users/password-reset/request`,
				{
					email: data.email.trim().toLowerCase(),
				},
			);
		},
		onSuccess: () => {
			setFeedback({ kind: "success", message: SUCCESS_MESSAGE });
		},
		onError: (error) => {
			const status = (error as AxiosError)?.response?.status;

			setFeedback({
				kind: "error",
				message:
					status === 429
						? "Too many attempts. Try again in a few minutes."
						: "Unable to send the reset link. Try again.",
			});
		},
	});

	const onSubmit: SubmitHandler<interfaces.ForgotPasswordProps> = (data) => {
		setFeedback(null);
		requestMutation.mutate(data);
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-col"
			noValidate
		>
			<label htmlFor="email" className="text-orange mb-2">
				Email
			</label>
			<input
				id="email"
				type="email"
				autoComplete="email"
				{...register("email")}
				className={
					errors.email
						? "px-2 border-solid border-2 h-10 rounded-lg min-w-60 border-rose-500 focus-visible:outline-red-500"
						: "px-2 border-solid border-2 h-10 border-gray rounded-lg min-w-60 outline-orange"
				}
			/>
			{errors.email && (
				<span className="font-sans font-bold text-red-500">
					{errors.email.message}
				</span>
			)}
			{feedback && (
				<p
					role={feedback.kind === "success" ? "status" : "alert"}
					className={
						feedback.kind === "success"
							? "text-green-700 text-sm mt-3"
							: "text-red-600 text-sm mt-3"
					}
				>
					{feedback.message}
				</p>
			)}
			<button
				type="submit"
				className="bg-orange h-10 rounded-lg mt-8 disabled:opacity-75"
				disabled={requestMutation.isPending}
			>
				<span className="font-bold font text-white">
					{requestMutation.isPending
						? "Sending..."
						: "Send reset link"}
				</span>
			</button>
			<p className="text-gray mt-4 text-center">
				<Link href="/" className="cursor-pointer">
					<u className="text-orange">Back to sign in</u>
				</Link>
			</p>
		</form>
	);
}
