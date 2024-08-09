import FormComponent from "@/components/FormComponent/FormComponent";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24 justify-center gap-10">
      <h1 className="text-orange text-4xl text-center">Community Cares</h1>
      <section>
        <FormComponent />
      </section>
    </main>
  );
}
