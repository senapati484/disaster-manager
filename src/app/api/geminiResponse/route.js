import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { query } = await req.json();
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    // Use the tuned model instead of the base model.
    const model = genAI.getGenerativeModel({
      model: "tunedModels/disaster-api-ya3iv5rn580y",
    });
    const result = await model.generateContent(query);
    const responseText = await result.response.text();

    return new Response(JSON.stringify({ response: responseText }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error calling tuned Gemini API:", error);
    return new Response(
      JSON.stringify({ error: "Failed to get response from tuned Gemini API" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
