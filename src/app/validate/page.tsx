"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Check, X, MapPin, Phone, Building2, AlertCircle } from "lucide-react";
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
  const [isLoading, setIsLoading] = useState(true);

  async function getPendingLocations() {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/pending-locations`,
      );

      if (response.status === 200) setPendingLocations(response.data.payload);
    } catch (error) {
      console.error(
        "Unable to retrieve data from pendingLocations /getPendingLocations",
      );
      toast.error("Failed to load pending locations.");
    } finally {
      setIsLoading(false);
    }
  }

  async function postPendingLocationIntoLocations(
    pendingLocation: interfaces.PendingLocationsProps,
  ) {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    try {
      const response = await axios.post(
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
        },
      );

      if (response.status === 201) {
        setPendingLocations(
          pendingLocations.filter((p) => p.id !== pendingLocation.id),
        );
        toast.success("Location approved successfully!");
      }
    } catch (error) {
      console.error("Unable to perform request, please try again", error);
      toast.error("Unable to approve location. Please try again.");
    }
  }

  async function deletePendingLocation(id: number) {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API}/pending-locations/${id}`,
        {
          headers: {
            Authorization: `Bearer ${cookieValue}`,
          },
        },
      );

      if (response.status === 200) {
        setPendingLocations(pendingLocations.filter((p) => p.id !== id));
        toast.info("Location request rejected.");
      }
    } catch (error) {
      console.error("Unable to perform request, please try again", error);
      toast.error("Unable to reject location. Please try again.");
    }
  }

  useEffect(() => {
    getPendingLocations();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50/50 p-4 sm:p-8 md:p-12 lg:p-16">
      <div className="max-w-7xl mx-auto space-y-8 animate-accordion-down">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-heading text-orange tracking-tight">
            Pending Locations
          </h1>
          <p className="text-slate-500 text-sm max-w-2xl">
            Review and validate community-submitted locations. Approved
            locations will be immediately visible to all users.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="p-12 flex flex-col items-center justify-center text-slate-400 gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange"></div>
              <span className="text-sm font-medium">Loading requests...</span>
            </div>
          ) : pendingLocations.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center text-center gap-4">
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  No pending requests
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  Great job! You&apos;re all caught up.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                    <TableHead className="w-[200px] font-semibold text-slate-700">
                      Name / Type
                    </TableHead>
                    <TableHead className="w-1/4 font-semibold text-slate-700">
                      Address
                    </TableHead>
                    <TableHead className="w-48 font-semibold text-slate-700">
                      Contact
                    </TableHead>
                    <TableHead className="w-1/6 font-semibold text-slate-700">
                      Coordinates
                    </TableHead>
                    <TableHead className="w-[140px] text-right font-semibold text-slate-700 pr-6">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingLocations.map((location) => (
                    <TableRow
                      key={location.id}
                      className="group hover:bg-slate-50 transition-colors"
                    >
                      <TableCell className="align-top py-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-slate-900">
                            {location.name}
                          </span>
                          <span className="inline-flex items-center w-fit px-2 py-0.5 rounded-full text-xs font-medium bg-orange/50 text-orange-700">
                            {location.type}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="align-top py-4 max-w-xs xl:max-w-md">
                        <div
                          className="flex items-start gap-2 text-sm text-slate-600 cursor-pointer hover:text-orange transition-colors"
                          title="Double click to copy full address"
                          onDoubleClick={() => {
                            navigator.clipboard.writeText(location.address);
                            toast.success("Address copied!", {
                              autoClose: 2000,
                              position: "bottom-center",
                            });
                          }}
                        >
                          <MapPin className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                          <span className="truncate block font-medium">
                            {location.address}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="align-top py-4">
                        {location.contact ? (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                            <span>{location.contact}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic pl-6">
                            Not provided
                          </span>
                        )}
                      </TableCell>

                      <TableCell className="align-top py-4 max-w-[200px]">
                        <div
                          className="flex flex-col gap-0.5 text-xs font-mono text-slate-500 cursor-pointer hover:text-orange transition-colors"
                          title="Double click to copy coordinates"
                          onDoubleClick={() => {
                            navigator.clipboard.writeText(
                              `${location.coords.latitude}, ${location.coords.longitude}`,
                            );
                            toast.success("Coordinates copied!", {
                              autoClose: 2000,
                              position: "bottom-center",
                            });
                          }}
                        >
                          <div className="flex items-center gap-1 truncate">
                            <span className="font-bold text-slate-400 select-none">
                              LAT
                            </span>
                            <span className="truncate">
                              {location.coords.latitude}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 truncate">
                            <span className="font-bold text-slate-400 select-none">
                              LNG
                            </span>
                            <span className="truncate">
                              {location.coords.longitude}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="align-top py-4 text-right">
                        <div className="flex justify-end items-center gap-1 transition-all duration-200">
                          <button
                            type="button"
                            onClick={() => deletePendingLocation(location.id)}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-md"
                            title="Reject request"
                            aria-label={`Reject ${location.name}`}
                          >
                            <X className="h-5 w-5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              postPendingLocationIntoLocations(location)
                            }
                            className="p-2 rounded-lg text-slate-400 hover:text-green-600 hover:bg-green-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded-md"
                            title="Approve request"
                            aria-label={`Approve ${location.name}`}
                          >
                            <Check className="h-5 w-5" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      <ToastContainer position="bottom-right" theme="colored" />
    </main>
  );
}
