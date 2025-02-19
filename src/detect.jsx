import React, { useState } from "react";
import "./styles.css"; // Import CSS

function LanguageDetector() {
  const [text, setText] = useState("");
  const [detectedLanguage, setDetectedLanguage] = useState("");
  const [error, setError] = useState("");

  const detectLanguage = async () => {
    try {
      setError("");
      if (!text.trim()) {
        setError("Please enter some text.");
        return;
      }
      if (!self.ai?.languageDetector?.create) {
        setError("Language detection is not available in this environment.");
        return;
      }
      const detector = await self.ai.languageDetector.create();
      const results = await detector.detect(text);
      if (results.length > 0) {
        setDetectedLanguage(results[0].detectedLanguage);
      } else {
        setError("No language detected.");
      }
    } catch (error) {
      console.error("Error detecting language:", error);
      setError("Failed to detect language. Please try again.");
    }
  };

  return (
    <div className="chat-container">
      <h2 className="chat-header">Language Detection</h2>
      <div className="chat-box">
        <textarea
          className="chat-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to detect language..."
        />
        <button className="send-btn" onClick={detectLanguage}>Detect Language</button>
        {error && <p className="error-text">{error}</p>}
        {detectedLanguage && <p className="chat-bubble received">Detected: {detectedLanguage}</p>}
      </div>
    </div>
  );
}

export default LanguageDetector;
