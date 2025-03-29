// src/app/api/allDisaster/route.js

import { database } from "@/utils/firebase";
import { ref, get } from "firebase/database";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const minLat = parseFloat(searchParams.get("minLat"));
    const minLon = parseFloat(searchParams.get("minLon"));
    const maxLat = parseFloat(searchParams.get("maxLat"));
    const maxLon = parseFloat(searchParams.get("maxLon"));

    // Read data from Firebase at the "allDisaster" node
    const snapshot = await get(ref(database, "allDisaster"));

    if (!snapshot.exists()) {
      return NextResponse.json(
        { data: null, message: "No data available" },
        { status: 404 }
      );
    }

    const data = snapshot.val();

    // Convert the returned object into an array of disasters
    let disasters = Object.keys(data).map((key) => ({
      id: key,
      ...data[key],
    }));

    // If viewport bounds are provided, filter disasters within these bounds.
    if (!isNaN(minLat) && !isNaN(minLon) && !isNaN(maxLat) && !isNaN(maxLon)) {
      disasters = disasters.filter((disaster) => {
        // Assuming each disaster record has a "location" object with "lat" and "lon" properties.
        const lat = disaster.location?.lat;
        const lon = disaster.location?.lon;
        return (
          typeof lat === "number" &&
          typeof lon === "number" &&
          lat >= minLat &&
          lat <= maxLat &&
          lon >= minLon &&
          lon <= maxLon
        );
      });
    }

    return NextResponse.json({ data: disasters });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
