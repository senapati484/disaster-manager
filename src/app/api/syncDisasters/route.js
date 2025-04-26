// src/app/api/syncDisasters/route.js

import { database } from "@/utils/firebase";
import { ref, set } from "firebase/database";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  try {
    // Fetch disaster events from NASA's EONET API (open events)
    const eonetUrl = "https://eonet.gsfc.nasa.gov/api/v3/events?status=open";
    const response = await fetch(eonetUrl);
    if (!response.ok) {
      throw new Error(`EONET API responded with status ${response.status}`);
    }
    const eonetData = await response.json();
    const events = eonetData.events || [];

    // Store (or replace) the entire data set in the "allDisaster" node
    await set(ref(database, "allDisaster"), events);

    return NextResponse.json(
      { success: true, message: "Scheduled task completed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error syncing disaster data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Scheduled task failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
