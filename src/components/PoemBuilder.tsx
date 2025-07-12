"use client";

import React, { useState } from "react";

// DO NOT import the poems directly here. We will get them from the API route.
// const themes = ["Love", "Nature", "Loss", "Freedom", "Hope", "Chaos", "Resilience"];
// const moods = ["Joyful", "Melancholy", "Thoughtful", "Excited", "Calm", "Hopeful"];

// The full list of themes and moods can be defined here, as they are not AI-generated.
const themes = ["Love", "Nature", "Loss", "Freedom", "Hope", "Chaos", "Resilience"];
const moods = ["Joyful", "Melancholy", "Thoughtful", "Excited", "Calm", "Hopeful"];

// Define the type for the poem data you get back from the API
interface PoemResponse {
  poem: string;
}

const teamMembers = [
  "Prudhvi Raj – Leader",
  "Pritika Ajwani – Co-Leader",
  "Partha Pratim Bheem – Member",
  "Vinisha – Member",
  "Vishwas Rao – Member"
];

const PoemBuilder = () => {
  const [theme, setTheme] = useState("dark");
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [poem, setPoem] = useState<string | null>(null); // Poem is now a string
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  // This is the new, correct way to generate the poem
  const generatePoem = async () => {
    setError("");
    setPoem(null);
    setIsLoading(true);

    // You can use your selected themes and moods as "tags" for the AI
    const tags = [selectedTheme, selectedMood].filter(Boolean);

    try {
      const response = await fetch("/api/getPoem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: "Write a poem", tags }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch poem from API.");
      }

      const data: PoemResponse = await response.json();
      setPoem(data.poem);

    } catch (err) {
      console.error(err);
      setError("Failed to generate poem. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen p-8 transition-colors duration-300 ${
        theme === "dark" ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Poem Builder</h1>
        <button
          onClick={toggleTheme}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Toggle Theme
        </button>
      </div>

      <section className="mb-4">
        <h2 className="text-xl font-semibold">Select Theme:</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          {themes.map(t => (
            <button
              key={t}
              onClick={() => setSelectedTheme(t)}
              className={`px-3 py-1 border rounded-full ${
                selectedTheme === t
                  ? "bg-green-600 text-white"
                  : "bg-transparent text-green-600 border-green-600"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold">Select Mood:</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          {moods.map(m => (
            <button
              key={m}
              onClick={() => setSelectedMood(m)}
              className={`px-3 py-1 border rounded-full ${
                selectedMood === m
                  ? "bg-green-600 text-white"
                  : "bg-transparent text-green-600 border-green-600"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </section>

      <button
        onClick={generatePoem}
        disabled={isLoading}
        className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? "Generating..." : "Generate Poem"}
      </button>

      {error && (
        <div className="mt-8 p-4 border-l-4 border-red-500 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
          <p>{error}</p>
        </div>
      )}

      {poem && (
        <div className="mt-8 p-4 border rounded bg-opacity-20 backdrop-blur-lg">
          <h2 className="text-xl font-semibold mb-2">📝 Your Poem</h2>
          <pre className="whitespace-pre-wrap">{poem}</pre>
        </div>
      )}

      <footer className="mt-12 text-sm text-center opacity-75">
        <p>Team Members:</p>
        {teamMembers.map((name, index) => (
          <p key={index}>{name}</p>
        ))}
      </footer>
    </div>
  );
};

export default PoemBuilder;