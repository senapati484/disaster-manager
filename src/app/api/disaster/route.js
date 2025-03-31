// src/app/api/disaster/route.js

import { NextResponse } from "next/server";

// Helper: Convert degrees to radians.
const toRadians = (degrees) => (degrees * Math.PI) / 180;

// Helper: Calculate distance between two points (in kilometers) using the Haversine formula.
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export async function GET(request) {
  try {
    // Get query parameters from the URL (lat, lon, and optional radius in km)
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get("lat"));
    const lon = parseFloat(searchParams.get("lon"));
    const radius = parseFloat(searchParams.get("radius")) || 50;

    if (isNaN(lat) || isNaN(lon)) {
      return NextResponse.json(
        { error: "Please provide valid 'lat' and 'lon' query parameters." },
        { status: 400 }
      );
    }

    // Fetch disaster events from NASA's EONET API (open events)
    const eonetUrl = "https://eonet.gsfc.nasa.gov/api/v3/events?status=open";
    const response = await fetch(eonetUrl);
    const eonetData = await response.json();

    const events = eonetData.events || [];

    // Filter events using the event's "geometry" array
    const filteredEvents = events.filter((event) => {
      if (!event.geometry || event.geometry.length === 0) return false;
      return event.geometry.some((geom) => {
        if (Array.isArray(geom.coordinates) && geom.coordinates.length >= 2) {
          // Coordinates provided as [longitude, latitude]
          const [eventLon, eventLat] = geom.coordinates;
          const distance = haversineDistance(lat, lon, eventLat, eventLon);
          return distance <= radius;
        }
        return false;
      });
    });

    return NextResponse.json({ events: filteredEvents });
  } catch (error) {
    console.error("Error fetching disaster events:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
