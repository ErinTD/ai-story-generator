"use client";

import { useState } from "react";
import Image from "next/image";

export default function StoryGenerator() {
  const [language, setLanguage] = useState("");
  const [level, setLevel] = useState("Novice");
  const [wordCount, setWordCount] = useState("100");
  const [location, setLocation] = useState("");
  const [characters, setCharacters] = useState("");
  const [situation, setSituation] = useState("");
  const [targetStructures, setTargetStructures] = useState("");
  const [story, setStory] = useState("");
  const [questions, setQuestions] = useState("");
  const [includeQuestions, setIncludeQuestions] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateStory = async () => {
    setLoading(true);
    const questionPart = includeQuestions ? "Generate 5-10 simple comprehension questions based on the story." : "";
    const prompt = `Write a story in ${language} for a ${level} learner. The story should be about ${wordCount} words long. Set the story in ${location}, with characters named ${characters}. Include the situation: ${situation}. Use the following target structures, and include each one at least 3 times: ${targetStructures}. ${questionPart}`;

    try {
      const response = await fetch("/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();

      if (includeQuestions && data.story.includes("Q1")) {
        const parts = data.story.split("Q1");
        setStory(parts[0].trim());
        setQuestions("Q1" + parts[1].trim());
      } else {
        setStory(data.story);
        setQuestions("");
      }
    } catch (error) {
      console.error("Error generating story:", error);
      setStory("Something went wrong. Please try again.");
      setQuestions("");
    } finally {
      setLoading(false);
    }
  };

  const downloadAsPDF = () => {
    const content = `Story:\n\n${story}\n\n${questions ? `Comprehension Questions:\n\n${questions}` : ""}`;
    const blob = new Blob([content], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "generated_story.pdf";
    link.click();
  };

  return (
    <main style={{ padding: "2rem", maxWidth: "700px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <header style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Image src="/storygeneratorbanner.PNG" alt="Banner" width={700} height={150} />
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginTop: "1rem" }}>AI Story Generator</h1>
      </header>

      <div style={{ display: "grid", gap: "1rem" }}>
        <label style={{ fontWeight: "bold" }}>Language</label>
        <input value={language} onChange={(e) => setLanguage(e.target.value)} />

        <label style={{ fontWeight: "bold" }}>Proficiency Level</label>
        <select value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="Novice">Novice</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <label style={{ fontWeight: "bold" }}>Word Count</label>
        <select value={wordCount} onChange={(e) => setWordCount(e.target.value)}>
          <option value="100">100</option>
          <option value="200">200</option>
          <option value="300">300</option>
          <option value="500">500</option>
          <option value="1000">1000</option>
          <option value="2000">2000</option>
        </select>

        <label style={{ fontWeight: "bold" }}>Location</label>
        <input value={location} onChange={(e) => setLocation(e.target.value)} />

        <label style={{ fontWeight: "bold" }}>Character Name(s)</label>
        <input value={characters} onChange={(e) => setCharacters(e.target.value)} />

        <label style={{ fontWeight: "bold" }}>Situation</label>
        <textarea value={situation} onChange={(e) => setSituation(e.target.value)} />

        <label style={{ fontWeight: "bold" }}>Target Vocabulary</label>
        <textarea value={targetStructures} onChange={(e) => setTargetStructures(e.target.value)} />

        <label style={{ fontWeight: "bold" }}>
          <input type="checkbox" checked={includeQuestions} onChange={(e) => setIncludeQuestions(e.target.checked)} />
          Include 5–10 comprehension questions
        </label>

        <button onClick={generateStory} disabled={loading} style={{ padding: "0.5rem", fontWeight: "bold" }}>
          {loading ? "Generating..." : "Generate Story"}
        </button>
      </div>

      {(story || questions) && (
        <div style={{ marginTop: "2rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem" }}>Generated Story</h2>
          <p style={{ whiteSpace: "pre-wrap" }}>{story}</p>
          {questions && (
            <>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", marginTop: "1rem" }}>Comprehension Questions</h3>
              <p style={{ whiteSpace: "pre-wrap" }}>{questions}</p>
            </>
          )}
          <button onClick={downloadAsPDF} style={{ marginTop: "1rem", padding: "0.5rem" }}>Download as PDF</button>
        </div>
      )}
    </main>
  );
}
