import React, { useState, useEffect } from 'react';
import { Globe2, ArrowRightLeft, FileText } from 'lucide-react';
import "./styles.css";

const languageOptions = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'tr', name: 'Turkish' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
];

function App() {
  const [text, setText] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('fr');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const processText = async () => {
      if (text.trim()) {
        setIsProcessing(true);
        try {
          await detectLanguage();
          await translateText();
          await summarizeText();
        } catch (err) {
          console.error('Error processing text:', err);
        } finally {
          setIsProcessing(false);
        }
      } else {
        setDetectedLanguage('');
        setTranslatedText('');
        setSummary('');
      }
    };

    const timeoutId = setTimeout(processText, 500);
    return () => clearTimeout(timeoutId);
  }, [text, sourceLang, targetLang]);

  const detectLanguage = async () => {
    try {
      setError('');
      if (!self.ai?.languageDetector?.create) {
        throw new Error('Language detection not available.');
      }
      const detector = await self.ai.languageDetector.create();
      const results = await detector.detect(text);
      const detectedCode = results.length > 0 ? results[0].detectedLanguage : 'Unknown';
  
      // Map language code to full name
      const languageName = languageOptions.find(lang => lang.code === detectedCode)?.name || 'Unknown';
      setDetectedLanguage(languageName);
    } catch (error) {
      console.error('Error detecting language:', error);
      setError('Failed to detect language.');
    }
  };
  

  const translateText = async () => {
    try {
      setError('');
      const translator = await self.ai.translator.create({
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
      });
      setTranslatedText(await translator.translate(text));
    } catch (error) {
      console.error('Error translating text:', error);
      setError('Translation failed.');
    }
  };

  const summarizeText = async () => {
    try {
      setError('');
      if (!text.trim()) return;
      const summarizer = await self.ai.summarizer.create();
      setSummary(await summarizer.summarize(text));
    } catch (error) {
      console.error('Error summarizing text:', error);
      setError('Summarization failed.');
    }
  };

  return (
    <div className="container">
      <div className="content">
        <header className="header">
          <h1 className="title">
            <Globe2 className="w-8 h-8" />
            LanguageSync
          </h1>
          <p className="subtitle">Detect, translate, and summarize text instantly</p>
        </header>

        <div className="input-section">
          <textarea
            className="textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to detect language, translate, or summarize..."
          />

          <div className="language-controls">
            <div className="language-group">
              <label className="language-label">Source Language</label>
              <select
                className="language-select"
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
              >
                {languageOptions.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="arrow-icon">
              <ArrowRightLeft className="w-6 h-6" />
            </div>
            <div className="language-group">
              <label className="language-label">Target Language</label>
              <select
                className="language-select"
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
              >
                {languageOptions.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <div className="results">
          {isProcessing && (
            <div className="processing">
              Processing...
            </div>
          )}
          
          {detectedLanguage && (
            <div className="result-card">
              <div className="result-header">
                <Globe2 className="w-5 h-5" />
                Detected Language
              </div>
              <p className="result-content">{detectedLanguage}</p>
            </div>
          )}

          {translatedText && (
            <div className="result-card">
              <div className="result-header">
                <ArrowRightLeft className="w-5 h-5" />
                Translation
              </div>
              <p className="result-content">{translatedText}</p>
            </div>
          )}

          {summary && (
            <div className="result-card">
              <div className="result-header">
                <FileText className="w-5 h-5" />
                Summary
              </div>
              <p className="result-content">{summary}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;