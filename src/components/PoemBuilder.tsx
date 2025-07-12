"use client";

import React, { useState } from "react";
import { poems, Poem } from "@/data/poems";

const themes = ["Love", "Nature", "Loss", "Freedom", "Hope", "Chaos", "Resilience"];
const moods = ["Joyful", "Melancholy", "Thoughtful", "Excited", "Calm", "Hopeful"];

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
  const [poem, setPoem] = useState<Poem | null>(null);
  const [error, setError] = useState("");

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const generatePoem = () => {
    setError("");

    if (!selectedTheme || !selectedMood) {
      setError("Please select both a theme and a mood.");
      setPoem(null);
      return;
    }

    // Key for local storage
    const storageKey = `${selectedTheme}_${selectedMood}_shown_poems`;

    // Retrieve and parse shown poems from local storage
    const shownPoemsIds = new Set<string>(JSON.parse(localStorage.getItem(storageKey) || "[]"));

    const filteredPoems = poems.filter(
      (p) => p.theme === selectedTheme && p.mood === selectedMood
    );

    // Filter out poems that have already been shown
    const unshownPoems = filteredPoems.filter(
      (p) => !shownPoemsIds.has(p.text) // Using text as a unique ID for simplicity
    );

    // If all poems for this combination have been shown, reset the list
    let finalPoemList = unshownPoems;
    if (unshownPoems.length === 0) {
      localStorage.removeItem(storageKey);
      finalPoemList = filteredPoems;
    }

    if (finalPoemList.length === 0) {
      setError("No poems found for this combination. Please try another.");
      setPoem(null);
      return;
    }

    // Pick a random poem from the (now non-repeating) list
    const randomPoem = finalPoemList[Math.floor(Math.random() * finalPoemList.length)];

    // Update local storage with the new shown poem
    const newShownPoemsIds = new Set(shownPoemsIds);
    newShownPoemsIds.add(randomPoem.text);
    localStorage.setItem(storageKey, JSON.stringify(Array.from(newShownPoemsIds)));

    setPoem(randomPoem);
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
        className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
      >
        Generate Poem
      </button>

      {error && (
        <div className="mt-8 p-4 border-l-4 border-red-500 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
          <p>{error}</p>
        </div>
      )}

      {poem && (
        <div className="mt-8 p-4 border rounded bg-opacity-20 backdrop-blur-lg">
          <h2 className="text-xl font-semibold mb-2">📝 Your Poem</h2>
          <pre className="whitespace-pre-wrap">{poem.text}</pre>
          <p className="mt-4 text-sm opacity-75">Theme: {poem.theme} | Mood: {poem.mood}</p>
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