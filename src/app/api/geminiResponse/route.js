import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { query } = await req.json();

    // Check if query exists
    if (!query) {
      return new Response(
        JSON.stringify({ error: "Query parameter is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Use GEMINI_API_KEY instead of NEXT_PUBLIC_GEMINI_API_KEY
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    // Check if API key exists
    if (!apiKey) {
      console.error("Gemini API key is not configured");
      return new Response(
        JSON.stringify({ error: "API key configuration error" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "tunedModels/disaster-api-ya3iv5rn580y",
    });

    const result = await model.generateContent(query);
    if (!result) {
      throw new Error("No result returned from Gemini API");
    }
    console.log(result);

    // Check if result exists
    if (!result || !result.response) {
      throw new Error("Invalid response from Gemini API");
    }

    const responseText = await result.response.text();

    return new Response(JSON.stringify({ response: responseText }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error calling tuned Gemini API:", error);
    const errorMessage = error.message.includes("SAFETY")
      ? "Your query was blocked due to safety filters. Please try rephrasing your question."
      : "Failed to get response from tuned Gemini API";
    return new Response(
      JSON.stringify({
        error: errorMessage,
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
