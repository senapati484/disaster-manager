import { storeJson } from "@/lib/contract";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Parse the request body containing Gemini's response
    const { jsonData } = await request.json();

    // Store the JSON data on Avalanche blockchain
    const result = await storeJson(jsonData);

    return NextResponse.json({
      success: true,
      message: "Gemini response stored on Avalanche blockchain",
      data: result,
    });
  } catch (error) {
    console.error("Error storing Gemini response:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
