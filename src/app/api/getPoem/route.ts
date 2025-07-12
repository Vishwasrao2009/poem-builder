import { NextRequest, NextResponse } from "next/server";
import poemsDB from "@/poems.json"; // see step B

export async function POST(req: NextRequest) {
  const { theme, mood } = await req.json();
  const key = `${theme}|||${mood}`;
  const arr = poemsDB[key] || [];
  const poem = arr.shift() || "No pre-generated poem left for that combination.";
  return NextResponse.json({ poem });
}
