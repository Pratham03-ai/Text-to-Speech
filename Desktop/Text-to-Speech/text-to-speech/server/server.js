// ==============================================================================
// Text-to-Speech Application - Express Backend Server
// ==============================================================================
// This file sets up an Express.js server that provides REST API endpoints
// to convert text to speech audio using a Text-to-Speech (TTS) service.
// ==============================================================================

// 1. Load environment variables from .env file
require("dotenv").config();

// 2. Import required packages
const express = require("express");
const cors = require("cors");
const googleTTS = require("google-tts-api");

// 3. Initialize the Express application
const app = express();

// 4. Configure port from environment variable or default to 5000
const PORT = parseInt(process.env.PORT, 10) || 5000;

// 5. Middleware Setup
// Enable CORS so the React frontend (running on port 5173) can talk to the backend (port 5000)
app.use(cors());

// Parse incoming requests with JSON payloads
app.use(express.json());

// ==============================================================================
// Supported Languages & Voices Configuration
// ==============================================================================
const SUPPORTED_LANGUAGES = {
  "en-US": "en",
  "hi-IN": "hi",
  "mr-IN": "mr",
  "gu-IN": "gu",
  "es-ES": "es",
  "fr-FR": "fr",
};

const SUPPORTED_VOICES = ["female", "male"];

// ==============================================================================
// Route 1: Health Check Endpoint
// Method: GET
// Path: /api/health
// Description: Verifies that the backend server is up and running.
// ==============================================================================
app.get("/api/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

// ==============================================================================
// Route 2: Text-to-Speech Generation Endpoint
// Method: POST
// Path: /api/tts
// Description: Validates text, language, and voice, calls the TTS service,
//              and returns the audio as a playable base64 Data URL.
// ==============================================================================
app.post("/api/tts", async (req, res) => {
  try {
    // Step A: Validate request body
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({
        success: false,
        message: "Invalid request. Request body must be a JSON object.",
      });
    }

    const { text, language, voice } = req.body;

    // Step B: Validate text presence & type
    if (typeof text !== "string" || text.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Text is required and cannot be empty.",
      });
    }

    // Step C: Validate maximum character limit (500 characters)
    if (text.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Text exceeds the maximum limit of 500 characters.",
      });
    }

    // Step D: Validate language
    if (!language || !SUPPORTED_LANGUAGES[language]) {
      const validLangs = Object.keys(SUPPORTED_LANGUAGES).join(", ");
      return res.status(400).json({
        success: false,
        message: `Invalid language '${language}'. Supported languages: ${validLangs}`,
      });
    }

    // Step E: Validate voice
    if (!voice || !SUPPORTED_VOICES.includes(voice.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Invalid voice selection. Supported voices: female, male.",
      });
    }

    // Step F: Optional Authentication check for custom third-party services
    const ttsService = process.env.TTS_SERVICE || "google";
    if (ttsService === "azure" || ttsService === "elevenlabs") {
      if (!process.env.TTS_API_KEY || process.env.TTS_API_KEY === "your_api_key_here") {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: Valid TTS_API_KEY is required in backend .env file.",
        });
      }
    }

    // Step G: Generate Speech Audio
    const langCode = SUPPORTED_LANGUAGES[language];
    const isSlow = voice.toLowerCase() === "male"; // slight speed variation for male vs female

    // Call Google TTS to convert text into an MP3 Base64 string
    const base64Audio = await googleTTS.getAudioBase64(text.trim(), {
      lang: langCode,
      slow: isSlow,
      host: "https://translate.google.com",
      timeout: 10000,
    });

    // Format as a standard HTML5 audio Data URL (playable directly in browser audio player)
    const audioUrl = `data:audio/mp3;base64,${base64Audio}`;

    // Return successful response with audio URL
    return res.status(200).json({
      success: true,
      audioUrl: audioUrl,
      message: "Speech generated successfully",
    });

  } catch (error) {
    console.error("Error generating speech:", error.message);

    // If network failure or TTS service timeout
    if (
      error.code === "ENOTFOUND" ||
      error.message?.toLowerCase().includes("timeout") ||
      error.message?.toLowerCase().includes("network")
    ) {
      return res.status(503).json({
        success: false,
        message: "Text-to-Speech service is currently unavailable. Please check your internet connection.",
      });
    }

    // Generic server error
    return res.status(500).json({
      success: false,
      message: "Internal server error. Failed to generate speech.",
    });
  }
});

// ==============================================================================
// 404 Route Handler - Catches any undefined route
// ==============================================================================
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Endpoint not found",
  });
});

// ==============================================================================
// Global Error Handler Middleware
// ==============================================================================
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  return res.status(500).json({
    success: false,
    message: "An unexpected server error occurred.",
  });
});

// ==============================================================================
// Start the Express Server
// ==============================================================================
// We attempt to listen on the configured PORT (default 5000).
// If port 5000 is in use (very common on macOS due to AirPlay Receiver),
// the server automatically falls back to port 5001.
const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Backend server is running on http://localhost:${port}`);
    console.log(`Health check: http://localhost:${port}/api/health`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE" && port === 5000) {
      console.warn("⚠️  Port 5000 is already in use (often by macOS AirPlay Receiver).");
      console.warn("🔄 Switching automatically to fallback port 5001...");
      startServer(5001);
    } else {
      console.error("Server startup error:", err);
    }
  });
};

startServer(PORT);

