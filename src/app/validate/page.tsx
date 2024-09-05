"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import * as interfaces from "@/types/interfaces";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

  async function postPendingLocationIntoLocations(
    pendingLocation: interfaces.PendingLocationsProps
  ) {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    try {
      const response = await axios.post(
        "https://community-cares-server.onrender.com/locations",
        {
          id: pendingLocation.id,
          name: pendingLocation.name,
          type: pendingLocation.type,
          address: pendingLocation.address,
          contact: pendingLocation.contact,
          coords: {
            latitude: pendingLocation.coords.latitude,
            longitude: pendingLocation.coords.longitude,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${cookieValue}`,
          },
        }
      );

      if (response.status === 201) {
        setPendingLocations(
          pendingLocations.filter((p) => p.id !== pendingLocation.id)
        );
        toast.success("Pending location successfully approved!");
      }
    } catch (error) {
      console.error("Unable to perform request, please try again", error);
      toast.error("Unable to approve pending location, please try again.");
    }
  }

  async function deletePendingLocation(id: number) {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    try {
      const response = await axios.delete(
        `https://community-cares-server.onrender.com/pending-location/${id}`,
        {
          headers: {
            Authorization: `Bearer ${cookieValue}`,
          },
        }
      );

      if (response.status === 200) {
        setPendingLocations(pendingLocations.filter((p) => p.id !== id));
        toast.success("Pending location successfully deleted!");
      }
    } catch (error) {
      console.error("Unable to perform request, please try again", error);
      toast.error("Unable to deleted pending location, please try again.");
    }
  }

  useEffect(() => {
    getPendingLocations();
  }, []);

  return (
    <main className="flex flex-col items-center justify-start py-8 px-32 h-screen w-full gap-20">
      <span className="text-orange font-extrabold text-2xl">
        Pending locations
      </span>
      <Table>
        <TableCaption>A list of your recent shared locations.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-orange font-sans">Name</TableHead>
            <TableHead className="text-orange font-sans">Type</TableHead>
            <TableHead className="text-orange font-sans">Address</TableHead>
            <TableHead className="text-orange font-sans">Contact</TableHead>
            <TableHead className="text-orange font-sans">Coordinates</TableHead>
            <TableHead className="text-orange font-sans">Validate</TableHead>
            <TableHead className="text-orange font-sans">Exclude</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingLocations.map((pendingLocation) => (
            <TableRow key={pendingLocation.id}>
              <TableCell className="font-medium text-neutral-700">
                {pendingLocation.name}
              </TableCell>
              <TableCell className="text-neutral-700">
                {pendingLocation.type}
              </TableCell>
              <TableCell className="text-neutral-700">
                {pendingLocation.address}
              </TableCell>
              <TableCell className="text-neutral-700">
                {pendingLocation.contact}
              </TableCell>
              <TableCell className="text-neutral-700">
                {pendingLocation.coords.latitude +
                  " | " +
                  pendingLocation.coords.longitude}
              </TableCell>
              <TableCell>
                <button
                  type="button"
                  className="bg-orange text-white p-4"
                  onClick={() =>
                    postPendingLocationIntoLocations(pendingLocation)
                  }
                >
                  <strong>Approve</strong>
                </button>
              </TableCell>
              <TableCell>
                <button
                  type="button"
                  className="bg-red-500 text-white p-4"
                  onClick={() => deletePendingLocation(pendingLocation.id)}
                >
                  <strong>Reprove</strong>
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ToastContainer />
    </main>
  );
}
