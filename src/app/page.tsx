import SignInFormComponent from "@/components/SignInFormComponent/SignInFormComponent";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 sm:p-8">
      <div className="w-full max-w-[400px] space-y-8 animate-accordion-down">
        <div className="flex flex-col items-center text-center space-y-2">
          <h1 className="text-orange font-heading text-4xl md:text-5xl tracking-tight">
            Community Cares
          </h1>
          <p className="text-slate-500 text-sm font-medium">Admin Panel</p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100">
          <SignInFormComponent />
        </div>

        <div className="text-center">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Community Cares. All rights
            reserved.
          </p>
        </div>
      </div>
    </main>
  );
}
