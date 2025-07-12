import { NextResponse } from "next/server";
import { poems } from "@/data/poems";

export async function POST(request: Request) {
  try {
    const { tags } = await request.json(); // 'prompt' is removed from destructuring
    
    const [selectedTheme, selectedMood] = tags;
    
    if (!selectedTheme || !selectedMood) {
      return NextResponse.json({ error: "Please select both a theme and a mood." }, { status: 400 });
    }

    const filteredPoems = poems.filter(
      (p: { theme: string; mood: string; }) => 
        p.theme === selectedTheme && p.mood === selectedMood
    );

    if (filteredPoems.length === 0) {
      return NextResponse.json({ error: "No poems found for this combination. Please try another." }, { status: 404 });
    }
    
    const randomPoem = filteredPoems[Math.floor(Math.random() * filteredPoems.length)];

    return NextResponse.json({ poem: randomPoem.text }, { status: 200 });

  } catch (error: unknown) {
    console.error("API Error:", error);
    
    if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}