// ==============================================================================
// Text-to-Speech Application - React Frontend
// ==============================================================================
// This component provides a clean, user-friendly interface for converting text
// into spoken audio. It manages state using React's useState hook, validates
// user input, communicates with the Express backend using the Fetch API, and
// provides audio playback and download capabilities.
// ==============================================================================

import { useState } from "react";
import "./App.css";

function App() {
  // ----------------------------------------------------------------------------
  // State Variables
  // ----------------------------------------------------------------------------
  // 'text': Stores the current text entered in the textarea
  const [text, setText] = useState("");

  // 'language': Stores the selected language code (default: English "en-US")
  const [language, setLanguage] = useState("en-US");

  // 'voice': Stores the selected voice ("female" or "male")
  const [voice, setVoice] = useState("female");

  // 'audioUrl': Stores the Base64 Data URL of the generated audio
  const [audioUrl, setAudioUrl] = useState("");

  // 'loading': Boolean flag indicating whether speech generation is in progress
  const [loading, setLoading] = useState(false);

  // 'error': Stores any error message to display to the user
  const [error, setError] = useState("");

  // Maximum allowed characters for Level 1 basic application
  const maxCharacters = 500;

  // ----------------------------------------------------------------------------
  // Calculated Values: Word Count
  // ----------------------------------------------------------------------------
  // Splits by whitespace to count words accurately, ignoring leading/trailing spaces
  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  // ----------------------------------------------------------------------------
  // API Call Helper with Port Fallback
  // ----------------------------------------------------------------------------
  // Tries port 5000 first (standard Express port), and automatically falls back
  // to port 5001 if port 5000 is occupied (e.g., macOS AirPlay Receiver).
  const callTTSApi = async (payload) => {
    const ports = [5000, 5001];
    let lastError = null;

    for (const port of ports) {
      try {
        const response = await fetch(`http://localhost:${port}/api/tts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        return response;
      } catch (err) {
        lastError = err;
      }
    }

    throw new Error(
      "Unable to connect to backend server. Please verify the server is running."
    );
  };

  // ----------------------------------------------------------------------------
  // Event Handler: Generate Speech
  // ----------------------------------------------------------------------------
  const handleGenerate = async () => {
    // Clear previous error and audio before starting a new request
    setError("");
    setAudioUrl("");

    // Validation 1: Check for empty text
    if (text.trim() === "") {
      setError("Please enter some text before generating speech.");
      return;
    }

    // Validation 2: Check for character limit
    if (text.length > maxCharacters) {
      setError(`Maximum limit is ${maxCharacters} characters.`);
      return;
    }

    try {
      setLoading(true);

      const response = await callTTSApi({
        text: text.trim(),
        language: language,
        voice: voice,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate speech.");
      }

      // Save generated audio Data URL into state
      setAudioUrl(data.audioUrl);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------------------------------
  // Event Handler: Clear All Inputs
  // ----------------------------------------------------------------------------
  const handleClear = () => {
    setText("");
    setAudioUrl("");
    setError("");
  };

  // ----------------------------------------------------------------------------
  // Component Render
  // ----------------------------------------------------------------------------
  return (
    <div className="app">
      <div className="container">
        <h1>TEXT TO SPEECH</h1>
        <p className="subtitle">Convert your text into spoken audio</p>

        {/* Text Input Section */}
        <div className="form-group">
          <label htmlFor="tts-textarea">Enter your text:</label>
          <textarea
            id="tts-textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here..."
            maxLength={maxCharacters}
            rows={6}
          />
        </div>

        {/* Character and Word Counters */}
        <div className="count">
          <span>
            Characters: {text.length}/{maxCharacters}
          </span>
          <span>Words: {wordCount}</span>
        </div>

        {/* Language Selection */}
        <div className="form-group">
          <label htmlFor="tts-language">Language:</label>
          <select
            id="tts-language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en-US">English</option>
            <option value="hi-IN">Hindi</option>
            <option value="mr-IN">Marathi</option>
            <option value="gu-IN">Gujarati</option>
            <option value="es-ES">Spanish</option>
            <option value="fr-FR">French</option>
          </select>
        </div>

        {/* Voice Selection */}
        <div className="form-group">
          <label htmlFor="tts-voice">Voice:</label>
          <select
            id="tts-voice"
            value={voice}
            onChange={(e) => setVoice(e.target.value)}
          >
            <option value="female">Female Voice</option>
            <option value="male">Male Voice</option>
          </select>
        </div>

        {/* Error Message Alert */}
        {error && (
          <div className="error" role="alert">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="buttons">
          <button
            type="button"
            className="generate-btn"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? "Generating Speech..." : "Generate Speech"}
          </button>

          <button
            type="button"
            className="clear-btn"
            onClick={handleClear}
            disabled={loading}
          >
            Clear
          </button>
        </div>

        {/* Generated Audio Player & Download Section */}
        {audioUrl && (
          <div className="audio-section">
            <h2>Generated Audio</h2>

            <audio controls src={audioUrl}>
              Your browser does not support the audio element.
            </audio>

            <a
              className="download-btn"
              href={audioUrl}
              download="speech.mp3"
            >
              Download Audio
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;