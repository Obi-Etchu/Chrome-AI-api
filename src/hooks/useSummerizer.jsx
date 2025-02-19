import { useState } from "react";

export default function useSummarizer() {
  const [summarizer, setSummarizer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");

  async function initializeSummarizer() {
    try {
      console.log("Initializing summarizer...");
      const aiSummarizer = await self.ai.summarizer.create();
      console.log("Summarizer initialized:", aiSummarizer);
      setSummarizer(aiSummarizer);
    } catch (error) {
      console.error("Error initializing summarizer:", error);
    }
  }

  async function summarizeText(text) {
    if (!summarizer) {
      console.error("Summarizer not initialized!");
      return;
    }

    setLoading(true);
    try {
      const result = await summarizer.summarize(text);
      setSummary(result.output);
    } catch (error) {
      console.error("Error summarizing text:", error);
    }
    setLoading(false);
  }

  return { initializeSummarizer, summarizeText, summary, loading };
}
