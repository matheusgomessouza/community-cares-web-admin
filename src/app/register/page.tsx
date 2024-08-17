import SignUpFormComponent from "@/components/SignUpFormComponent/SignUpFormComponent";

export default function RegisterScreen() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24 justify-evenly xl:min-w-96 gap-10">
      <span className="text-orange font-extrabold text-2xl text-center">
        Sign up to Community Cares
      </span>
      <SignUpFormComponent />
    </main>
  );
}
