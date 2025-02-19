import React, { useState } from "react";
import "./styles.css"; // Import CSS

const languageOptions = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "tr", name: "Turkish" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "pt", name: "Portuguese " },
  { code: "ru", name: "Russian" },
];

function Translator() {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("es");
  const [targetLang, setTargetLang] = useState("en");

  const translateText = async () => {
    try {
      const translator = await self.ai.translator.create({
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
      });
      const translation = await translator.translate(sourceText);
      setTranslatedText(translation);
    } catch (error) {
      console.error("Error translating text:", error);
      setTranslatedText("Translation failed. Please try again.");
    }
  };

  return (
    <div className="chat-container">
      <h2 className="chat-header">Text Translator</h2>
      <div className="chat-box">
        <textarea
          className="chat-input"
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
          placeholder="Enter text to translate..."
        />
        <div className="chat-options">
          <label>
            Source:
            <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)}>
              {languageOptions.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Target:
            <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
              {languageOptions.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button className="send-btn" onClick={translateText}>Translate</button>
        {translatedText && <p className="chat-bubble received">Translated: {translatedText}</p>}
      </div>
    </div>
  );
}

export default Translator;
