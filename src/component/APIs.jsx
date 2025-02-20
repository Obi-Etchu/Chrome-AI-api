import React, { useState } from 'react';
import { Send } from 'lucide-react';
import './styles.css';


const languageOptions = [
  { code: 'en', name: 'English' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'es', name: 'Spanish' },
  { code: 'ru', name: 'Russian' },
  { code: 'tr', name: 'Turkish' },
  { code: 'fr', name: 'French' },
  // { code: 'de', name: 'German' },
  // { code: 'zh', name: 'Chinese' },
  // { code: 'ja', name: 'Japanese' },
];

function App() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showLanguageSelect, setShowLanguageSelect] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Add user message
    const newMessage = {
      id: Date.now(),
      text: inputText,
      type: 'user',
      timestamp: new Date().toLocaleTimeString(),
      language: null,
      translation: null,
      summary: null,
      showSummary: false,
      showTranslation: false
    };

    // Add system message asking about translation
    const systemMessage = {
      id: Date.now() + 1,
      text: "Would you like to translate this text?",
      type: 'system',
      timestamp: new Date().toLocaleTimeString(),
      responseFor: newMessage.id,
      responded: false
    };

    setMessages(prev => [...prev, newMessage, systemMessage]);
    setInputText('');

    try {
      // Detect language
      const detector = await self.ai.languageDetector.create();
      const results = await detector.detect(inputText);
      const detectedLanguage = results.length > 0 ? results[0].detectedLanguage : 'Unknown';

      // Update message with detected language
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id
          ? { ...msg, language: detectedLanguage }
          : msg
      ));
    } catch (error) {
      console.error('Error processing message:', error);
    }
  };

  const handleTranslationResponse = async (messageId, translate) => {
    if (translate) {
      setShowLanguageSelect(prev => ({ ...prev, [messageId]: true }));
    } else {
      // Mark system message as responded and remove it
      setMessages(prev => prev.filter(msg =>
        !(msg.type === 'system' && msg.responseFor === messageId)
      ));
    }
  };

  const handleTranslate = async (messageId) => {
    try {
      // Find the original message
      const originalMessage = messages.find(msg => msg.id === messageId);
      
      // Create translator
      const translator = await self.ai.translator.create({
        sourceLanguage: originalMessage.language,
        targetLanguage: selectedLanguage
      });
      
      // Get translation
      const translation = await translator.translate(originalMessage.text);

      // Update message with translation
      setMessages(prev => prev.map(msg =>
        msg.id === messageId
          ? { ...msg, translation, showTranslation: true }
          : msg
      ));

      // Remove the "Would you like to translate?" system message
      setMessages(prev => prev.filter(msg =>
        !(msg.type === 'system' && msg.responseFor === messageId)
      ));
      setShowLanguageSelect(prev => ({ ...prev, [messageId]: false }));
    } catch (error) {
      console.error('Error translating text:', error);
    }
  };

  const handleSummarize = async (messageId) => {
    try {
      // Find the original message
      const originalMessage = messages.find(msg => msg.id === messageId);
      
      // Summarize the text (assuming you have a summarization API)
      const summarizer = await self.ai.summarizer.create();
      const summary = await summarizer.summarize(originalMessage.text);

      // Update message with summary
      setMessages(prev => prev.map(msg =>
        msg.id === messageId
          ? { ...msg, summary, showSummary: true }
          : msg
      ));
    } catch (error) {
      console.error('Error summarizing text:', error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message-wrapper ${message.type === 'system' ? 'message-wrapper-left' : 'message-wrapper-right'}`}
          >
            <div className={`message ${message.type === 'system' ? 'message-system' : 'message-user'}`}>
              <div className="message-text">{message.text}</div>
              
              {message.type === 'system' && !message.responded && !showLanguageSelect[message.responseFor] && (
                <div className="system-buttons">
                  <button 
                    className="system-button yes"
                    onClick={() => handleTranslationResponse(message.responseFor, true)}
                  >
                    Yes
                  </button>
                  <button 
                    className="system-button no"
                    onClick={() => handleTranslationResponse(message.responseFor, false)}
                  >
                    No
                  </button>
                </div>
              )}

              {showLanguageSelect[message.responseFor] && (
                <div className="language-select-container">
                  <select
                    className="language-select"
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                  >
                    {languageOptions.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                  <button 
                    className="system-button yes"
                    onClick={() => handleTranslate(message.responseFor)}
                  >
                    Translate
                  </button>
                </div>
              )}

              {message.type === 'user' && message.language && (
                <div className="message-language">
                  Language: {message.language}
                </div>
              )}

              {message.type === 'user' && message.translation && message.showTranslation && (
                <div className="translation-bubble">
                  <div className="translation-label">Translated text:</div>
                  <div className="translation-text">{message.translation}</div>
                </div>
              )}

              {message.type === 'user' && message.text.length > 150 && !message.showSummary && (
                <button 
                  className="summarize-button"
                  onClick={() => handleSummarize(message.id)}
                >
                  Summarize
                </button>
              )}

              {message.type === 'user' && message.summary && message.showSummary && (
                <div className="summary-text">
                  Summary: {message.summary}
                </div>
              )}

              <div className="message-timestamp">{message.timestamp}</div>
            </div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="chat-input">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message..."
          className="input-field"
        />
        <button type="submit" className="send-button">
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}

export default App;