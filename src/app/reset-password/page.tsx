import { Suspense } from "react";

import ResetPasswordFormComponent from "@/components/ResetPasswordFormComponent/ResetPasswordFormComponent";

export const metadata = {
	title: "Reset password | Community Cares Admin",
	robots: { index: false, follow: false },
};

export default function ResetPasswordScreen() {
	return (
		<main className="flex min-h-screen flex-col items-center p-24 justify-evenly xl:min-w-96 gap-10">
			<span className="text-orange font-extrabold text-2xl text-center">
				Choose a new password
			</span>
			<Suspense fallback={<p className="text-gray text-sm">Loading...</p>}>
				<ResetPasswordFormComponent />
			</Suspense>
		</main>
	);
}
