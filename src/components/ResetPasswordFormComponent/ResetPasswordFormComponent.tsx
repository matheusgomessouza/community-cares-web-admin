"use client";

import axios, { type AxiosError } from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";

import * as interfaces from "@/types/interfaces";

type ValidationResponse = {
	valid: boolean;
	expiresAt: string;
};

function InvalidLink() {
	return (
		<section className="flex flex-col items-center gap-4">
			<p role="alert" className="text-red-600 text-sm font-bold">
				This link is invalid or expired.
			</p>
			<Link href="/forgot-password" className="text-orange font-bold">
				<u>Request a new link</u>
			</Link>
		</section>
	);
}

export default function ResetPasswordFormComponent() {
	const searchParams = useSearchParams();
	const token = searchParams.get("token") ?? "";
	const router = useRouter();
	const [feedback, setFeedback] = useState<string | null>(null);

	const validation = useQuery<ValidationResponse>({
		queryKey: ["password-reset-token", token],
		queryFn: async () => {
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_API}/admin-users/password-reset/validate`,
				{ params: { token } },
			);

			return response.data;
		},
		enabled: token.length > 0,
		retry: false,
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<interfaces.ResetPasswordProps>({
		resolver: zodResolver(interfaces.ResetPasswordSchema),
	});

	const resetMutation = useMutation({
		mutationFn: async (data: interfaces.ResetPasswordProps) => {
			return axios.post(
				`${process.env.NEXT_PUBLIC_API}/admin-users/password-reset/confirm`,
				{ token, password: data.password },
			);
		},
		onSuccess: () => {
			router.replace("/");
		},
		onError: (error) => {
			const status = (error as AxiosError)?.response?.status;

			setFeedback(
				status === 429
					? "Too many attempts. Try again in a few minutes."
					: status === 400
						? "This link is invalid or expired."
						: "Unable to reset the password. Try again.",
			);
		},
	});

	const onSubmit: SubmitHandler<interfaces.ResetPasswordProps> = (data) => {
		setFeedback(null);
		resetMutation.mutate(data);
	};

	if (!token) return <InvalidLink />;

	if (validation.isLoading) {
		return <p className="text-gray text-sm">Checking your link...</p>;
	}

	if (validation.isError || !validation.data?.valid) {
		return <InvalidLink />;
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-col"
			noValidate
		>
			<label htmlFor="new-password" className="text-orange mb-2">
				New password
			</label>
			<input
				id="new-password"
				type="password"
				autoComplete="new-password"
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
			<label htmlFor="confirm-password" className="text-orange mt-4 mb-2">
				Confirm password
			</label>
			<input
				id="confirm-password"
				type="password"
				autoComplete="new-password"
				{...register("confirmPassword")}
				className={
					errors.confirmPassword
						? "px-2 border-solid border-2 h-10 rounded-lg min-w-60 border-rose-500 focus-visible:outline-red-500"
						: "px-2 border-solid border-2 h-10 border-gray rounded-lg min-w-60 outline-orange"
				}
			/>
			{errors.confirmPassword && (
				<span className="font-sans font-bold text-red-500">
					{errors.confirmPassword.message}
				</span>
			)}
			{feedback && (
				<p role="alert" className="text-red-600 text-sm mt-3">
					{feedback}
				</p>
			)}
			<button
				type="submit"
				className="bg-orange h-10 rounded-lg mt-8 disabled:opacity-75"
				disabled={resetMutation.isPending}
			>
				<span className="font-bold font text-white">
					{resetMutation.isPending
						? "Saving..."
						: "Set new password"}
				</span>
			</button>
		</form>
	);
}
