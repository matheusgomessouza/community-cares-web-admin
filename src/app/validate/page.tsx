"use client";

import axios from "axios";
import { useEffect, useState } from "react";

import * as interfaces from "@/types/interfaces";

export default function ValidateScreen() {
  const [pendingLocations, setPendingLocations] = useState<
    interfaces.PendingLocationsProps[]
  >([]);

  async function getPendingLocations() {
    try {
      const response = await axios.get(
        "https://community-cares-server.onrender.com/pending-locations"
      );

      if (response.status === 200) setPendingLocations(response.data);
    } catch (error) {
      console.error(
        "Unable to retrieve data from pendingLocations /getPendingLocations"
      );
    }
  }

  useEffect(() => {
    // Getting the JWT token to approve Locations
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    getPendingLocations();
  }, []);

  return (
    <main className="flex items-start justify-center py-8 px-8 h-screen w-full">
      <span className="text-orange font-extrabold text-2xl">
        Pending locations
      </span>
      <code>
        {/* {pendingLocations.map((item) => (
          <p key={item.}>{item}</p>
        ))} */}
      </code>
    </main>
  );
}
