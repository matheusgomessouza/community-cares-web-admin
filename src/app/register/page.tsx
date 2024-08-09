import Link from "next/link";

export default function RegisterScreen() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24 justify-evenly xl:min-w-96 gap-10">
      <span className="text-orange font-extrabold text-2xl text-center">
        Sign up to Community Cares
      </span>
      <form action="" className="flex flex-col gap-8 justify-center">
        <section className="flex flex-col xl:flex-row gap-9 min-w-full">
          <div className="flex flex-col">
            <label htmlFor="" className="text-orange mb-2">
              Name
            </label>
            <input
              type="text"
              name=""
              id=""
              className="border-solid border-2 h-10 border-gray rounded-lg outline-orange"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="" className="text-orange mb-2">
              Username
            </label>
            <input
              type="text"
              name=""
              id=""
              className="border-solid border-2 h-10 border-gray rounded-lg outline-orange"
            />
          </div>
        </section>

        <div className="flex flex-col">
          <label htmlFor="" className="text-orange mb-2">
            Email
          </label>
          <input
            type="text"
            name=""
            id=""
            className="border-solid border-2 h-10 border-gray rounded-lg outline-orange"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="" className="text-orange mb-2">
            Password
          </label>
          <input
            type="text"
            name=""
            id=""
            className="border-solid border-2 h-10 border-gray rounded-lg outline-orange"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="" className="text-orange mb-2">
            Confirm password
          </label>
          <input
            type="text"
            name=""
            id=""
            className="border-solid border-2 h-10 border-gray rounded-lg outline-orange"
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
    </main>
  );
}
