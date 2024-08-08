import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24 justify-evenly">
      <h1 className="text-orange text-4xl text-center">Community Cares</h1>
      <section className="">
        <form action="" className="flex flex-col">
          <label htmlFor="" className="text-orange mb-2">
            Username
          </label>
          <input
            type="text"
            name=""
            id=""
            className="border-solid border-2 h-10 border-gray rounded-lg min-w-60 outline-orange"
          />
          <label htmlFor="" className="text-orange mt-4 mb-2">
            Password
          </label>
          <input
            type="text"
            name=""
            id=""
            className="border-solid border-2 h-10 border-gray rounded-lg min-w-60 outline-orange"
          />
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
      </section>
    </main>
  );
}
