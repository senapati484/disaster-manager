import { database } from "@/utils/firebase";
import { ref, push, set } from "firebase/database";
import { NextResponse } from "next/server";

/**
 * Example JSON body:
 * {
 *   "type": "Flood",
 *   "description": "Severe flooding in the area",
 *   "location": { "lat": 34.0522, "lon": -118.2437 },
 *   "severity": "High",
 *   "timestamp": 1689457200
 * }
 */
export async function POST(request) {
  try {
    // Parse the request body
    const data = await request.json();

    // Optional: Validate required fields
    if (!data.type || !data.description) {
      return NextResponse.json(
        { error: "Missing required fields: type, description" },
        { status: 400 }
      );
    }

    // Create a new key under "disasters" using push() for unique IDs
    const newDisasterRef = push(ref(database, "disasters"));

    // Write data to that new key
    await set(newDisasterRef, {
      ...data,
      createdAt: Date.now(), // Optionally store creation timestamp
    });

    return NextResponse.json({
      message: "Disaster data saved successfully",
      key: newDisasterRef.key,
    });
  } catch (error) {
    console.error("Error saving disaster data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
