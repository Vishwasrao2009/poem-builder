import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { poems } from "@/data/poems/poems"; // Assuming your file is named poems.ts
// If your file is named index.ts, the path is "@/data/poems"

// Load your API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { prompt, tags } = await request.json();

    // Select a Gemini model with broader availability
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    // The tags variable might be undefined, so we provide an empty array as a fallback
    const tagsString = (tags || []).join(", ");
    
    // You now have access to your poems from the file
    // Example: console.log(poems);

    // Create the full prompt for the AI
    const fullPrompt = `Write a poem based on this: "${prompt}". Use the following themes or moods: ${tagsString}. Make it beautiful, concise, and meaningful.`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ poem: text }, { status: 200 });
  } catch (error: any) {
    console.error("Gemini Error:", error);
    
    // Check for a specific Gemini error message
    if (error.response && error.response.status === 404) {
      return NextResponse.json({ error: "Gemini model not found. Please check your model name." }, { status: 500 });
    }

    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}