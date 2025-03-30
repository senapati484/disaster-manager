/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function AlertsPage() {
  const { user } = useAuth();
  const userId = user?.uid;
  const [disasters, setDisasters] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [search, setSearch] = useState("");
  // To hold previous disaster data for comparison
  const prevDisastersRef = useRef([]);
  const [hasSentInitialEmail, setHasSentInitialEmail] = useState(false);

  // Function to fetch user data.
  const fetchUserData = async () => {
    if (!userId) {
      console.log("No user logged in or user ID not available yet.");
      return;
    }
    try {
      const res = await fetch(`/api/data?uid=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch user data");
      const json = await res.json();
      const userData = json.data;
      if (userData?.location?.lat && userData?.location?.lon) {
        setUserLocation(userData.location);
      } else {
        toast("User Data", {
          description: "User location not found in your data.",
        });
      }
      if (Array.isArray(userData.disaster)) {
        setDisasters(userData.disaster);
        // Initialize the previous data reference as well
        prevDisastersRef.current = userData.disaster;
      } else {
        toast("No disaster data found", {
          description: "The user's disaster array is missing or empty.",
        });
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      toast("Error", { description: err.message });
    }
  };

  // Function to send an email by calling your API route.
  const sendEmailNotification = async (disasters) => {
    try {
      const disasterListText = disasters
        .map(
          (d, idx) =>
            `${idx + 1}. ${d.title}\n   ${
              d.description || "No description"
            }\n   Date: ${new Date(
              d.geometry[0].date
            ).toLocaleString()}\n   Coordinates: ${d.geometry[0].coordinates[1].toFixed(
              4
            )}, ${d.geometry[0].coordinates[0].toFixed(4)}`
        )
        .join("\n\n");

      const disasterListHTML = disasters
        .map(
          (d, idx) => `<li>
          <h3>${d.title}</h3>
          <p>${d.description || "No description"}</p>
          <p><strong>Date:</strong> ${new Date(
            d.geometry[0].date
          ).toLocaleString()}</p>
          <p><strong>Coordinates:</strong> ${d.geometry[0].coordinates[1].toFixed(
            4
          )}, ${d.geometry[0].coordinates[0].toFixed(4)}</p>
        </li>`
        )
        .join("");

      await fetch(`/api/sendEmail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: user.email,
          subject: `New Disaster Alerts Detected (${disasters.length} events)`,
          text: `Emergency Alert: ${disasters.length} disaster(s) detected in your area:\n\n${disasterListText}\n\nView details in your Disaster Manager dashboard.`,
          html: `<h2>Emergency Alert: ${disasters.length} Disaster(s) Detected</h2>
                <ul>${disasterListHTML}</ul>
                <p>View details in your <a href="${window.location.origin}/alerts">Disaster Manager dashboard</a></p>`,
        }),
      });
    } catch (err) {
      console.error("Error sending email:", err);
    }
  };

  // Function to fetch disaster data and compare with the current data.
  const fetchDisasterData = async () => {
    if (!userLocation) return;
    try {
      const { lat, lon } = userLocation;
      // First check if we have data in the database
      const dbRes = await fetch(`/api/data?uid=${userId}`);
      if (!dbRes.ok) throw new Error("Failed to fetch database data");
      const dbJson = await dbRes.json();
      let newDisasters = [];

      // If no data in database or empty disaster array, fetch from API
      if (!dbJson.data?.disaster || dbJson.data.disaster.length === 0) {
        const apiRes = await fetch(
          `/api/disaster?lat=${lat}&lon=${lon}&radius=500`
        );
        if (!apiRes.ok)
          throw new Error("Failed to fetch disaster data from API");
        const apiJson = await apiRes.json();
        newDisasters = apiJson.events;

        if (newDisasters.length === 0) {
          toast("No Disasters Found", {
            description: "No disasters found in your location at this time.",
          });
          setDisasters([]);
          prevDisastersRef.current = [];
          return;
        }
      } else {
        newDisasters = dbJson.data.disaster;
      }

      // Handle notifications and state updates
      if (!hasSentInitialEmail && newDisasters.length > 0) {
        // Initial load with disasters - send comprehensive email
        setDisasters(newDisasters);
        prevDisastersRef.current = newDisasters;
        await sendEmailNotification(newDisasters);
        setHasSentInitialEmail(true);
        toast("Disaster Alert", {
          description: `${newDisasters.length} disaster(s) detected in your area. Email notification sent.`,
        });
      } else if (
        JSON.stringify(newDisasters) !==
        JSON.stringify(prevDisastersRef.current)
      ) {
        // Subsequent updates - notify user of changes
        setDisasters(newDisasters);
        prevDisastersRef.current = newDisasters;
        toast("Updated Disasters", {
          description: `Disaster data has been updated. ${newDisasters.length} events found.`,
        });
      }
    } catch (err) {
      console.error("Error fetching disaster data:", err);
      toast("Error", { description: err.message });
    }
  };

  // Fetch user data on mount.
  useEffect(() => {
    fetchUserData();
  }, [userId]);

  // Once userLocation is available, set up periodic fetching.
  useEffect(() => {
    if (!userLocation) return;

    // Fetch immediately.
    fetchDisasterData();
    // Set up an interval to fetch disaster data every 5 minutes.
    const intervalId = setInterval(fetchDisasterData, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [userLocation]);

  const filteredDisasters = disasters.filter((event) => {
    if (!search) return true;
    return event.title?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="container mx-auto w-full max-w-screen-2xl px-3 sm:px-4 py-4 sm:py-8">
      {/* Header Section */}
      <div className="mb-8 flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
        <div className="w-full sm:w-auto">
          <h1 className="text-2xl sm:text-3xl font-bold">Disaster Alerts</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Real-time disaster data from NASA's EONET API for your area.
          </p>
        </div>
        {userLocation ? (
          <div className="w-full sm:w-auto bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg">
            <p className="text-xs sm:text-sm">Your Location:</p>
            <p className="font-semibold text-sm sm:text-lg">
              {userLocation.lat}, {userLocation.lon}
            </p>
          </div>
        ) : (
          <div className="w-full sm:w-auto bg-gray-200 text-gray-700 px-3 py-2 sm:px-4 sm:py-2 rounded-lg">
            <p className="text-xs sm:text-sm">User location not available</p>
          </div>
        )}
      </div>

      {/* Search Field */}
      <div className="mb-8 w-full sm:max-w-md">
        <Label htmlFor="search" className="mb-1 block text-sm sm:text-base">
          Search by Title
        </Label>
        <Input
          id="search"
          type="text"
          placeholder="e.g., Flood, Wildfire"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Disaster Count */}
      {disasters.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-semibold">
            There {disasters.length === 1 ? "is" : "are"}{" "}
            <span className="text-indigo-600">{disasters.length}</span> disaster
            {disasters.length === 1 ? "" : "s"} near you.
          </h2>
        </div>
      )}

      {/* Disaster Alerts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredDisasters.length === 0 ? (
          <p className="text-gray-500 text-sm sm:text-base">
            No disasters found in your data. Try adjusting your filters.
          </p>
        ) : (
          filteredDisasters.map((event) => {
            const eventTitle = event.title || "Untitled Event";
            const category =
              event.categories && event.categories.length > 0
                ? event.categories[0].title
                : "Unknown Category";
            const date = event.geometry?.[0]?.date
              ? new Date(event.geometry[0].date).toLocaleString()
              : "N/A";
            const coordinates = event.geometry?.[0]?.coordinates
              ? `${event.geometry[0].coordinates[1].toFixed(
                  4
                )}, ${event.geometry[0].coordinates[0].toFixed(4)}`
              : "N/A";
            const description =
              event.description || "No description available for this event.";
            const source =
              event.sources && event.sources.length > 0
                ? event.sources[0]
                : null;

            return (
              <Card
                key={event.id}
                className="shadow-lg hover:shadow-xl transition border-l-4 border-indigo-500 overflow-hidden"
              >
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-base sm:text-lg font-bold">
                    {eventTitle}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm text-indigo-600">
                    {category}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 sm:space-y-3 p-4 sm:p-6">
                  <p className="text-sm sm:text-base text-gray-700">
                    <strong>Date:</strong> {date}
                  </p>
                  <p className="text-sm sm:text-base text-gray-700">
                    <strong>Coordinates:</strong> {coordinates}
                  </p>
                  <p className="text-sm sm:text-base text-gray-700">
                    <strong>Description:</strong> {description}
                  </p>
                  {source && (
                    <p className="text-sm sm:text-base text-gray-700">
                      <strong>Source:</strong>{" "}
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        {source.id}
                      </a>
                    </p>
                  )}
                  <div className="mt-4">
                    <Button
                      asChild
                      variant="outline"
                      className="w-full sm:w-auto text-sm"
                    >
                      <a
                        href={event.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        More Info
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
