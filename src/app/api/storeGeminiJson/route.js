import {
  storeJson,
  getCurrentCycleInfo,
  getCurrentCycleResponses,
} from "@/lib/contract";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Parse the request body containing Gemini's response
    const { jsonData } = await request.json();

    // Store the JSON data on Avalanche blockchain
    const result = await storeJson(jsonData);

    // Get current cycle information
    const cycleInfo = await getCurrentCycleInfo();
    const currentCycleResponses = await getCurrentCycleResponses();

    return NextResponse.json({
      success: true,
      message: "Gemini response stored on Avalanche blockchain",
      data: {
        storedResponse: result,
        cycleInfo,
        currentCycleResponses,
      },
    });
  } catch (error) {
    console.error("Error storing Gemini response:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
