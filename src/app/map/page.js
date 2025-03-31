"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import dynamic from "next/dynamic";
import Link from "next/link";
// import { useMap } from "react-leaflet";

// const MapContainer = dynamic(
//   () => import("react-leaflet").then((mod) => mod.MapContainer),
//   { ssr: false }
// );
// const TileLayer = dynamic(\][']
//   () => import("react-leaflet").then((mod) => mod.TileLayer),
//   { ssr: false }
// );
// const Marker = dynamic(
//   () => import("react-leaflet").then((mod) => mod.Marker),
//   { ssr: false }
// );
// const useMap = dynamic(
//   () => import("react-leaflet").then((mod) => mod.useMap),
//   { ssr: false }
// );

// Function to fetch disaster data from EONET API
const fetchAllDisasterData = async () => {
  try {
    const res = await fetch("/api/syncDisasters");
    if (!res.ok) throw new Error("Failed to fetch disaster data");
    const json = await res.json();
    return json.data.map((event) => ({
      id: event.id,
      position: event.geometry[0].coordinates.slice(0, 2).reverse(),
      type: event.categories[0].title,
      severity: event.categories[0].id === "wildfires" ? "High" : "Medium",
      description: `${event.title}. Started: ${new Date(
        event.geometry[0].date
      ).toLocaleDateString()}`,
    }));
  } catch (err) {
    console.error("Error fetching disaster data:", err);
    return [];
  }
};

// Shelter marker data
const shelterMarkers = [
  {
    id: "3",
    position: [37.7849, -122.4094],
    name: "Safe Shelter 1",
    description: "Open shelter with medical facilities.",
  },
];

const incidentMarkers = [
  {
    id: "4",
    position: [37.7649, -122.4294],
    description: "User reported incident: Road blockage.",
  },
];

// MapControls: A component rendered inside MapContainer that uses useMap()
function MapControls() {
  const map = useMap();
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] flex gap-4 bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-lg">
      <Button
        onClick={() => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
              const { latitude, longitude } = position.coords;
              map.setView([latitude, longitude], 13);
            });
          }
        }}
      >
        Locate Me
      </Button>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => map.zoomIn()}>
          +
        </Button>
        <Button variant="outline" onClick={() => map.zoomOut()}>
          -
        </Button>
      </div>
    </div>
  );
}

export default function InteractiveMapPage() {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [offline, setOffline] = useState(false);
  const [disasterMarkers, setDisasterMarkers] = useState([]);

  // Fetch disaster data on component mount
  useEffect(() => {
    const loadDisasterData = async () => {
      const disasters = await fetchAllDisasterData();
      setDisasterMarkers(disasters);
    };
    loadDisasterData();
  }, []);

  // Monitor online/offline status
  useEffect(() => {
    if (typeof window === "undefined") return; // Ensure it's running in the browser
    const handleOffline = () => setOffline(true);
    const handleOnline = () => setOffline(false);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <div className="relative h-screen w-full">
      {/* Offline Notification */}
      {offline && (
        <div className="absolute top-0 left-0 right-0 z-60 p-2">
          <Alert variant="destructive">
            <AlertTitle>Offline</AlertTitle>
            <AlertDescription>
              Live map data may be outdated due to connectivity issues.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Left Side Overlays: Legend and Sidebar */}
      <div className="absolute top-4 left-4 z-50 space-y-4">
        <div className="p-2 bg-white rounded shadow w-64">
          <p className="text-sm font-bold mb-1">Legend</p>
          <ul className="text-xs">
            <li>
              <span className="inline-block w-3 h-3 bg-red-500 mr-2"></span>
              Disaster Zones
            </li>
            <li>
              <span className="inline-block w-3 h-3 bg-green-500 mr-2"></span>
              Safe Shelters
            </li>
            <li>
              <span className="inline-block w-3 h-3 bg-yellow-500 mr-2"></span>
              User Reports
            </li>
          </ul>
        </div>
        {selectedMarker && (
          <div className="p-2 bg-white rounded shadow w-64">
            <p className="text-sm font-bold mb-1">Details</p>
            <p className="text-xs">{selectedMarker.description}</p>
            {selectedMarker.severity && (
              <p className="mt-2 text-xs">
                <strong>Severity:</strong> {selectedMarker.severity}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Map Container */}
      <MapContainer
        center={[37.7749, -122.4194]}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full z-0"
      >
        <MapControls />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* Markers */}
        {disasterMarkers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            eventHandlers={{
              click: () => setSelectedMarker(marker),
            }}
          />
        ))}
        {shelterMarkers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            eventHandlers={{
              click: () => setSelectedMarker(marker),
            }}
          />
        ))}
        {incidentMarkers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            eventHandlers={{
              click: () => setSelectedMarker(marker),
            }}
          />
        ))}
      </MapContainer>

      {/* Sidebar / Overlay Panel for Marker Info */}
      {selectedMarker && (
        <div className="absolute bottom-4 left-4 z-50 w-full max-w-md p-4 bg-white rounded-3xl shadow">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedMarker.type ||
                  selectedMarker.name ||
                  "Incident Details"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{selectedMarker.description}</p>
              {selectedMarker.severity && (
                <p className="mt-2">
                  <strong>Severity:</strong> {selectedMarker.severity}
                </p>
              )}
              <div className="mt-4 flex gap-2">
                <Button variant="outline">
                  <Link href="guides">View Survival Guide</Link>
                </Button>
                <Button>
                  <a href={selectedMarker.link}>
                    <span className="text-sm font-bold">Link</span>
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
          <Button
            variant="ghost"
            className="mt-2"
            onClick={() => setSelectedMarker(null)}
          >
            Close
          </Button>
        </div>
      )}
    </div>
  );
}
