import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
// import { poems } from "@/data/poems/poems"; <-- This line is no longer needed

// Load your API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { prompt, tags } = await request.json();

    // Select a Gemini model with broader availability
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    // The tags variable might be undefined, so we provide an empty array as a fallback
    const tagsString = (tags || []).join(", ");

    // Create the full prompt for the AI
    const fullPrompt = `Write a poem based on this: "${prompt}". Use the following themes or moods: ${tagsString}. Make it beautiful, concise, and meaningful.`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ poem: text }, { status: 200 });
  } catch (error: unknown) { // Changed 'any' to 'unknown'
    console.error("Gemini Error:", error);
    
    // Check if the error is an instance of a standard Error
    if (error instanceof Error) {
        // You can now safely access the message property
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}