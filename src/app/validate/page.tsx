"use client";

import { useEffect } from "react";

export default function ValidateScreen() {
  useEffect(() => {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
  }, []);

  return (
    <main className="flex items-start justify-center py-8 px-8 h-screen w-full">
      <span className="text-orange font-extrabold text-2xl">
        Pending locations
      </span>
    </main>
  );
}
