"use client";

import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

const fetchPendingLocations = async () => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API}/pending-locations`
  );
  return response.data.payload as interfaces.PendingLocationsProps[];
};

export default function ValidateScreen() {
  const queryClient = useQueryClient();

  const { data: pendingLocations = [], isLoading } = useQuery({
    queryKey: ["pendingLocations"],
    queryFn: fetchPendingLocations,
  });

  const approveMutation = useMutation({
    mutationFn: async (pendingLocation: interfaces.PendingLocationsProps) => {
      const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      return axios.post(
        `${process.env.NEXT_PUBLIC_API}/locations`,
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
    },
    onSuccess: () => {
      toast.success("Pending location successfully approved!");
      queryClient.invalidateQueries({ queryKey: ["pendingLocations"] });
    },
    onError: (error) => {
      console.error("Unable to perform request, please try again", error);
      toast.error("Unable to approve pending location, please try again.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      return axios.delete(
        `${process.env.NEXT_PUBLIC_API}/pending-locations/${id}`,
        {
          headers: {
            Authorization: `Bearer ${cookieValue}`,
          },
        }
      );
    },
    onSuccess: () => {
      toast.success("Pending location successfully deleted!");
      queryClient.invalidateQueries({ queryKey: ["pendingLocations"] });
    },
    onError: (error) => {
      console.error("Unable to perform request, please try again", error);
      toast.error("Unable to deleted pending location, please try again.");
    },
  });

  return (
    <main className="flex flex-col items-center justify-start py-8 px-32 h-screen w-full gap-20">
      <span className="text-orange font-extrabold text-2xl">
        Pending locations
      </span>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
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
                    className="bg-orange text-white p-4 disabled:opacity-50"
                    disabled={approveMutation.isPending || deleteMutation.isPending}
                    onClick={() => approveMutation.mutate(pendingLocation)}
                  >
                    <strong>Approve</strong>
                  </button>
                </TableCell>
                <TableCell>
                  <button
                    type="button"
                    className="bg-red-500 text-white p-4 disabled:opacity-50"
                    disabled={approveMutation.isPending || deleteMutation.isPending}
                    onClick={() => deleteMutation.mutate(pendingLocation.id)}
                  >
                    <strong>Reprove</strong>
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <ToastContainer />
    </main>
  );
}
