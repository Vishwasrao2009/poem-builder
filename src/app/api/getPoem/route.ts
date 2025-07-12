import { NextResponse } from "next/server";
import { poems, Poem } from "@/data/poems/poems"; // Assuming your file is named poems.ts
import { title } from "process";

export async function POST(request: Request) {
  try {
    const { prompt, tags } = await request.json();

    const [selectedTheme, selectedMood] = tags;
    
    // Check if the theme and mood are selected
    if (!selectedTheme || !selectedMood) {
      return NextResponse.json({ error: "Please select both a theme and a mood." }, { status: 400 });
    }

    // Filter the poems array to find a match
    const filteredPoems = poems.filter(
      (p: { theme: string; mood: string; }) => 
        p.theme === selectedTheme && p.mood === selectedMood
    );

    // If no poems match, return an error
    if (filteredPoems.length === 0) {
      return NextResponse.json({ error: "No poems found for this combination. Please try another." }, { status: 404 });
    }
    
    // Select a random poem from the filtered list
    const randomPoem = filteredPoems[Math.floor(Math.random() * filteredPoems.length)];

    // Return the random poem's text
    return NextResponse.json({ poem: randomPoem.text }, { status: 200 });

  } catch (error: unknown) {
    console.error("API Error:", error);
    
    if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}