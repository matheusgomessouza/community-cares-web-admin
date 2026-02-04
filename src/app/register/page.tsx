import SignUpFormComponent from "@/components/SignUpFormComponent/SignUpFormComponent";

export default function RegisterScreen() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 sm:p-8">
      <div className="w-full max-w-[600px] space-y-8 animate-accordion-down">
        <div className="flex flex-col items-center text-center space-y-2">
          <h1 className="text-orange font-heading text-3xl md:text-4xl tracking-tight">
            Community Cares
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Create your admin account
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100">
          <SignUpFormComponent />
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
