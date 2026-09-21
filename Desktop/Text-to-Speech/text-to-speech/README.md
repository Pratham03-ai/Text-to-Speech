# 🎙️ Text-to-Speech Web Application (Level 1 – Basic)

A clean, beginner-friendly full-stack Text-to-Speech (TTS) web application built using **React.js** on the frontend and **Node.js + Express.js** on the backend. This project is designed as an introductory paired architecture project suitable for college submissions, hackathons, and self-learning.

---

## 📌 Project Overview

This application allows users to enter custom text (up to 500 characters), select their preferred language and voice, and convert the text into spoken audio in real time. Users can listen to the generated speech using the integrated browser audio player or download the audio file directly to their machine.

```
┌─────────────────┐       HTTP POST /api/tts       ┌──────────────────────┐
│                 │ ─────────────────────────────> │                      │
│ React Frontend  │   { text, language, voice }    │ Express Backend API  │
│  (Port 5173)    │ <───────────────────────────── │   (Port 5000/5001)   │
│                 │      { success, audioUrl }     └──────────┬───────────┘
└─────────────────┘                                           │
         ▲                                                    │ Calls TTS
         │                                                    ▼
         └───────────── Plays & Downloads MP3 ───── Text-to-Speech Engine
```

---

## ✨ Features

1. **Text Input Area**: Clean, spacious textarea for typing or pasting text.
2. **Real-Time Character Counter**: Displays current character usage with a strict 500-character maximum limit (`Characters: 0/500`).
3. **Dynamic Word Counter**: Automatically computes and updates word count as you type.
4. **Language Selection**: Choose from multiple languages including:
   - English (`en-US`)
   - Hindi (`hi-IN`)
   - Marathi (`mr-IN`)
   - Gujarati (`gu-IN`)
   - Spanish (`es-ES`)
   - French (`fr-FR`)
5. **Voice Selection**: Choose between Female Voice and Male Voice.
6. **Generate Speech**: Sends request to backend API to synthesize speech.
7. **Loading State**: Visual feedback ("Generating Speech...") and button disabling while processing.
8. **Built-in Audio Player**: HTML5 native controls with play, pause, seek bar, and volume slider.
9. **Download Audio**: One-click download button to save the generated `speech.mp3` locally.
10. **Clear Button**: Resets text, character counters, errors, and the audio player.
11. **Comprehensive Error Handling**: Validates empty text, character overflows, unsupported languages, and backend network status.
12. **Responsive Design**: Polished layout that looks great on mobile phones, tablets, and desktop computers.

---

## 🛠️ Technologies Used

### Frontend
- **React.js (v19)**: Component-based UI library.
- **Vite**: Ultra-fast modern frontend development build tool.
- **Vanilla CSS3**: Clean, responsive styling with no heavy third-party CSS frameworks.
- **Fetch API**: Browser-native API for making asynchronous HTTP requests.

### Backend
- **Node.js**: JavaScript runtime environment for the server.
- **Express.js**: Fast, minimalist web framework for building REST APIs.
- **cors**: Middleware to allow cross-origin requests between frontend and backend.
- **dotenv**: Loads environment variables from a `.env` file into `process.env`.
- **google-tts-api**: Converts text to MP3 speech audio without requiring paid cloud credit cards.

---

## 📂 Project Structure

```text
text-to-speech/
│
├── client/                      # React frontend
│   ├── src/
│   │   ├── App.jsx              # Main React application component
│   │   ├── App.css              # Custom styling for UI and responsive layout
│   │   └── main.jsx             # React entrypoint mounting App to DOM
│   ├── index.html               # Main HTML page template
│   ├── vite.config.js           # Vite development server configuration
│   └── package.json             # Frontend dependencies & scripts
│
├── server/                      # Node.js + Express backend
│   ├── server.js                # Express API server & TTS logic
│   ├── package.json             # Backend dependencies & scripts
│   └── .env                     # Server configuration & environment variables
│
├── .gitignore                   # Files and folders excluded from Git
└── README.md                    # Project documentation
```

---

## 🚀 Installation & Setup

### Prerequisites
Make sure you have **Node.js** (v18 or newer) and **npm** installed on your computer.
Check with:
```bash
node -v
npm -v
```

---

### Step 1: Clone or Navigate to the Project

```bash
cd text-to-speech
```

---

### Step 2: Set Up Backend

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
   *(Installs `express`, `cors`, `dotenv`, and `google-tts-api`)*

3. Configure environment variables:
   A `.env` file is already provided inside `server/`:
   ```env
   PORT=5000
   TTS_SERVICE=google
   TTS_API_KEY=your_api_key_here
   TTS_REGION=your_region_here
   TTS_ENDPOINT=your_endpoint_here
   ```

---

### Step 3: Set Up Frontend

1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```

---

## ▶️ How to Run the Application

You will run the backend and the frontend concurrently in two separate terminal windows:

### Terminal 1 — Start the Backend Server:
```bash
cd server
node server.js
```
*You will see:*
```text
Backend server is running on http://localhost:5000
Health check: http://localhost:5000/api/health
```
*(Note: If port 5000 is occupied by macOS AirPlay Receiver, the server automatically switches to fallback port 5001).*

---

### Terminal 2 — Start the React Frontend:
```bash
cd client
npm run dev
```
*You will see:*
```text
  VITE v8.x.x  ready in ... ms

  ➜  Local:   http://localhost:5173/
```

Open your browser and navigate to: **`http://localhost:5173`**

---

## 📡 API Endpoints Reference

### 1. Health Check
Checks if the backend server is online and operational.

- **Method**: `GET`
- **URL**: `http://localhost:5000/api/health` (or port `5001`)
- **Headers**: None
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Server is running"
  }
  ```

---

### 2. Text to Speech Conversion
Validates input text, parameters, synthesizes speech audio, and returns it as a Base64 Data URL.

- **Method**: `POST`
- **URL**: `http://localhost:5000/api/tts` (or port `5001`)
- **Headers**:
  ```http
  Content-Type: application/json
  ```
- **Request Body**:
  ```json
  {
    "text": "Hello, welcome to my Text-to-Speech application.",
    "language": "en-US",
    "voice": "female"
  }
  ```

- **Success Response** (`200 OK`):
  ```json
  {
    "success": true,
    "audioUrl": "data:audio/mp3;base64,//OExAAAAAAAA...",
    "message": "Speech generated successfully"
  }
  ```

- **Error Responses**:
  - `400 Bad Request` (Empty text):
    ```json
    {
      "success": false,
      "message": "Text is required and cannot be empty."
    }
    ```
  - `400 Bad Request` (Text exceeds 500 characters):
    ```json
    {
      "success": false,
      "message": "Text exceeds the maximum limit of 500 characters."
    }
    ```
  - `400 Bad Request` (Invalid language):
    ```json
    {
      "success": false,
      "message": "Invalid language 'xyz'. Supported languages: en-US, hi-IN, mr-IN, gu-IN, es-ES, fr-FR"
    }
    ```
  - `404 Not Found` (Unknown route):
    ```json
    {
      "success": false,
      "message": "Endpoint not found"
    }
    ```
  - `503 Service Unavailable` (Network/TTS failure):
    ```json
    {
      "success": false,
      "message": "Text-to-Speech service is currently unavailable. Please check your internet connection."
    }
    ```

---

## 🧪 Testing Guide

### 1. Test Backend Health Endpoint
Run this command in your terminal:
```bash
curl http://localhost:5000/api/health
```
*(or `http://localhost:5001/api/health` if using fallback port)*
Expected response:
```json
{"success":true,"message":"Server is running"}
```

---

### 2. Testing in Postman
You can test the backend API using Postman:

1. Open Postman and create a new request:
   - **Method**: `POST`
   - **URL**: `http://localhost:5000/api/tts`
2. Go to the **Headers** tab:
   - Key: `Content-Type`, Value: `application/json`
3. Go to the **Body** tab:
   - Select **raw** and set format to **JSON**.
   - Paste the following:
     ```json
     {
       "text": "Hello! Testing Text-to-Speech with Postman.",
       "language": "en-US",
       "voice": "female"
     }
     ```
4. Click **Send**.
5. Inspect the response:
   - Status: `200 OK`
   - Body contains `"success": true` and the `audioUrl` base64 string.

---

### 3. Test React Frontend in Browser
1. Open `http://localhost:5173`.
2. **Empty Validation**: Click "Generate Speech" with an empty box. An error alert *"Please enter some text before generating speech."* should appear.
3. **Character & Word Counter**: Type `Hello world`. The counters should show `Characters: 11/500` and `Words: 2`.
4. **Speech Generation**: Click **Generate Speech**. The button text changes to *"Generating Speech..."* and disables.
5. **Playback**: After speech generates, an audio player appears. Click Play to listen to the generated speech.
6. **Download**: Click **Download Audio** to save `speech.mp3`.
7. **Clear**: Click **Clear**. The textarea resets, counters return to 0, and the audio player disappears.

---

## 🧠 Core Concepts Explained (Beginner-Friendly)

### 1. React `useState`
`useState` is a React Hook that lets a functional component store and update values over time. Whenever you call its setter function (e.g., `setText("Hello")`), React automatically re-renders the component to display the new value on the screen.

### 2. Form Handling in React
In React, form inputs like `<textarea>` and `<select>` use **Controlled Components**. Their value is tied directly to React state (`value={text}`), and every keystroke triggers an `onChange` event that updates the state (`onChange={(e) => setText(e.target.value)}`).

### 3. Fetch API & HTTP POST
`fetch()` is a built-in browser JavaScript function used to communicate with servers over HTTP.
- **GET** requests retrieve data.
- **POST** requests send data to the server inside the request `body`.
In this app, `fetch()` sends a JSON object with the user's text, language, and voice selection to the Express backend.

### 4. JSON (JavaScript Object Notation)
JSON is a lightweight text-based format for exchanging data between client and server.
- `JSON.stringify(object)`: Converts a JavaScript object into a JSON string to send over the network.
- `response.json()`: Parses a JSON string received from the server back into a JavaScript object.

### 5. Node.js & Express.js
- **Node.js**: A runtime environment allowing JavaScript to run on your operating system (outside the browser).
- **Express.js**: A minimalist web framework for Node.js that simplifies routing, middleware integration, and handling incoming HTTP requests.

### 6. Environment Variables (`.env`)
The `.env` file stores sensitive or environment-specific values (like ports and API keys) outside the codebase.
- We load it using `dotenv`.
- Keeping credentials in `.env` and adding `.env` to `.gitignore` ensures secret keys are never accidentally uploaded to GitHub.

### 7. Audio Data URL (`data:audio/mp3;base64,...`)
Instead of saving temporary audio files to the server's hard drive or a database, the server encodes the audio bytes into a **Base64 Data URL**. The browser's native `<audio>` element can play this string directly, and an `<a>` tag with a `download` attribute can save it to the user's computer immediately.

---

## 🖼️ Application Preview

```text
┌────────────────────────────────────────────────────────┐
│                   TEXT TO SPEECH                       │
│           Convert your text into spoken audio          │
│                                                        │
│  Enter your text:                                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Hello, welcome to my Text-to-Speech app!         │  │
│  └──────────────────────────────────────────────────┘  │
│  Characters: 43/500                        Words: 7    │
│                                                        │
│  Language:                                             │
│  ┌──────────────────────────────────────────────────┐  │
│  │ English (en-US)                                ▼ │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  Voice:                                                │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Female Voice                                   ▼ │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  [  Generate Speech  ]                [ Clear ]        │
│                                                        │
│  ────────────────────────────────────────────────────  │
│  Generated Audio                                       │
│  ▶  ═══════════════════════════════════════ 🔊  ⋮     │
│                                                        │
│  [ ⬇ Download Audio ]                                  │
└────────────────────────────────────────────────────────┘
```

---

## 🔮 Future Improvements (Level 2 & Level 3)

For subsequent project stages, you can consider extending this application with:
1. **Speech Rate & Pitch Controls**: Sliders to speed up or slow down playback.
2. **Audio Waveform Visualizer**: Using the Web Audio API or Canvas to show sound waves while playing.
3. **Speech History**: Storing recent generations in localStorage or a database.
4. **Document Upload**: Reading `.txt` or `.pdf` files to convert full documents to audiobooks.
5. **Cloud Voice Providers**: Integrating advanced neural voices using Google Cloud Text-to-Speech or ElevenLabs APIs.

---

## 📄 License

This project is open-source and free to use for educational and personal learning purposes.
