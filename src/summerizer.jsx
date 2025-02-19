import { useState, useEffect } from "react";
import useSummarizer from "./hooks/useSummerizer";

export default function Summarizer() {
  const { initializeSummarizer, summarizeText, summary, loading } = useSummarizer();
  const [text, setText] = useState("");

  useEffect(() => {
    initializeSummarizer();
  }, []);

  return (
    <div style={{ 
      maxWidth: "600px", 
      margin: "40px auto", 
      padding: "20px", 
      background: "#f8f8f8", 
      borderRadius: "8px", 
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" 
    }}>
      <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "10px" }}>
        AI Text Summarizer
      </h2>
      
      <textarea
        style={{ 
          width: "100%", 
          padding: "10px", 
          border: "1px solid #ccc", 
          borderRadius: "5px", 
          fontSize: "14px" 
        }}
        rows="5"
        placeholder="Enter text to summarize..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={() => summarizeText(text)}
        disabled={loading}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          background: loading ? "#ccc" : "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: loading ? "default" : "pointer"
        }}
      >
        {loading ? "Summarizing..." : "Summarize"}
      </button>

      {summary && (
        <div style={{
          marginTop: "20px",
          padding: "10px",
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: "5px"
        }}>
          <h3 style={{ fontSize: "16px", fontWeight: "bold" }}>Summary:</h3>
          <p style={{ fontSize: "14px" }}>{summary}</p>
        </div>
      )}
    </div>
  );
}
