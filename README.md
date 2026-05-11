# 📸 Padhaq — Picto Quiz AI

> Turn any picture into a fun, AI-powered quiz instantly!

Padhaq is a full-stack web application that lets users upload an image of text (e.g. a textbook page, handwritten notes, or an article) and automatically generates multiple-choice quiz questions from it using OCR and Google Gemini AI.

---

## 📁 Project Structure

```
Padhaq/
├── backend/                # FastAPI Python server
│   ├── main.py             # API entry-point & route definitions
│   ├── ocr.py              # EasyOCR-based text extraction
│   ├── gemini_service.py   # Google Gemini AI integration
│   ├── quiz_generator.py   # Rule-based quiz fallback (demo)
│   ├── evaluator.py        # Answer evaluation logic
│   ├── requirements.txt    # Python dependencies
│   ├── .env                # Environment variables (API keys)
│   ├── uploads/            # Uploaded images (auto-created)
│   └── venv/               # Python virtual environment
│
├── frontend/               # React + TypeScript (Vite)
│   ├── src/
│   │   ├── App.tsx         # Main quiz application component
│   │   ├── ImageInput.jsx  # Image upload / drag-drop component
│   │   ├── upload.tsx      # Upload helper component
│   │   ├── main.tsx        # React DOM entry-point
│   │   ├── styles.css      # Full application styling
│   │   ├── App.css         # App-level styles
│   │   ├── index.css       # Global styles
│   │   └── assets/         # Static assets (logo, images)
│   ├── package.json        # Node.js dependencies & scripts
│   ├── vite.config.ts      # Vite build configuration
│   ├── tsconfig.json       # TypeScript configuration
│   └── .env                # Frontend environment variables
│
├── README.md               # ← You are here
└── .gitignore              # Git ignore rules
```

---

## 🔧 Tech Stack

### Backend

| Tool / Library | Purpose |
|---|---|
| **Python 3.10+** | Core language |
| **FastAPI** | High-performance async REST API framework |
| **Uvicorn** | ASGI server to run FastAPI |
| **EasyOCR** | Offline, free OCR engine for text extraction from images |
| **Google Generative AI (Gemini 2.5 Flash)** | AI model for MCQ generation |
| **python-dotenv** | Load environment variables from `.env` |
| **python-multipart** | Handle `multipart/form-data` file uploads |

### Frontend

| Tool / Library | Purpose |
|---|---|
| **React 19** | UI component library |
| **TypeScript** | Type-safe JavaScript |
| **Vite 7** | Lightning-fast dev server & build tool |
| **CSS (Vanilla)** | Custom styling with animations & gradients |
| **ESLint** | Code quality & linting |

---

## 🧠 How It Works

### End-to-End Flow

```
User uploads image
       ↓
Frontend sends image + language + numQuestions → POST /generate-quiz
       ↓
Backend saves image to /uploads
       ↓
EasyOCR extracts text from the image (offline, no API needed)
       ↓
Extracted text is validated (minimum 10 characters)
       ↓
Text is sent to Google Gemini 2.5 Flash with a structured prompt
       ↓
Gemini returns JSON array of MCQs (question, options A-D, correct answer)
       ↓
Backend parses, validates, and returns the quiz JSON
       ↓
Frontend renders interactive quiz with timer, progress bar, and scoring
```

### Backend Logic

1. **Image Upload** (`main.py`)  
   - Accepts `POST /generate-quiz` with multipart form data containing the image file, language, and number of questions.
   - Saves the uploaded image to the `uploads/` directory.

2. **OCR — Text Extraction** (`ocr.py`)  
   - Uses **EasyOCR** (English language model) to extract all readable text from the uploaded image.
   - Runs entirely offline — no external API calls needed for OCR.

3. **AI Quiz Generation** (`gemini_service.py`)  
   - Sends the extracted text to **Google Gemini 2.5 Flash** with a carefully crafted prompt.
   - The prompt instructs Gemini to:
     - Validate if the text is meaningful (rejects gibberish, too-short text, OCR noise from non-text images).
     - Generate the requested number of MCQs strictly from the given text.
     - Return strict JSON format with `question`, `options` (A–D), and `answer` fields.
   - Supports **multilingual** quiz generation (English, Hindi, Spanish).

4. **Response Validation** (`main.py`)  
   - Strips markdown code fences (` ```json `) from Gemini's response.
   - Parses JSON and validates the structure (must be an array of objects with required fields).
   - Returns meaningful error messages if anything fails.

5. **CORS Middleware**  
   - Configured to allow all origins (`*`), enabling the frontend dev server to communicate with the backend.

### Frontend Logic

1. **Image Input**  
   - Users select or drag-drop an image file via the `ImageInput` component.

2. **Configuration**  
   - Language selector (English / Hindi / Spanish).
   - Number of questions (1–20) input.

3. **Quiz Generation Request**  
   - Sends the image as `FormData` to the backend API via `fetch()`.
   - API URL is configured via the `VITE_API_BASE_URL` environment variable.

4. **Interactive Quiz UI**  
   - **13-second countdown timer** per question — auto-advances when time runs out.
   - **Progress bar** showing current position in the quiz.
   - **Answer feedback** — green highlight for correct, red for wrong, with ✔/✖ icons.
   - **Score screen** at the end with emoji-based feedback (🏆 ≥80%, 👏 ≥50%, 💪 <50%).

5. **Retry & Reset**  
   - "Retry Quiz" replays the same quiz.
   - "New Quiz" returns to the upload screen.

---

## 🚀 How to Run Locally

### Prerequisites

- **Python 3.10+** installed
- **Node.js 18+** and **npm** installed
- A **Google Gemini API key** ([Get one here](https://aistudio.google.com/app/apikey))

---

### 1️⃣ Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create a Python virtual environment
python -m venv venv

# Activate the virtual environment
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# Windows (CMD):
.\venv\Scripts\activate.bat
# macOS / Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Create a .env file with your Gemini API key
# (or edit the existing one)
echo GEMINI_API_KEY=your_api_key_here > .env

# Start the backend server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be running at **http://localhost:8000**. Visit http://localhost:8000 in your browser to confirm — you should see:
```json
{"message": "Backend is running"}
```

---

### 2️⃣ Frontend Setup

```bash
# Open a NEW terminal, navigate to the frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Make sure the .env file has the correct backend URL
# It should contain:
# VITE_API_BASE_URL=http://localhost:8000

# Start the frontend dev server
npm run dev
```

The frontend will be running at **http://localhost:5173** (default Vite port).

---

### 🎯 Quick Reference

| What | Command | URL |
|---|---|---|
| Start Backend | `uvicorn main:app --reload` | http://localhost:8000 |
| Start Frontend | `npm run dev` | http://localhost:5173 |
| Build Frontend | `npm run build` | — |
| Lint Frontend | `npm run lint` | — |

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Your Google Gemini API key |

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API URL (default: `http://localhost:8000`) |

---

## 📝 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check — returns `{"message": "Backend is running"}` |
| `POST` | `/generate-quiz` | Upload image & generate quiz |

### `POST /generate-quiz` — Request

| Field | Type | Required | Description |
|---|---|---|---|
| `image` | File | ✅ | Image file (PNG, JPG, etc.) |
| `language` | String | ✅ | Quiz language (`English`, `Hindi`, `Spanish`) |
| `num_questions` | Integer | ❌ | Number of MCQs to generate (default: 5) |

### `POST /generate-quiz` — Response

```json
{
  "extracted_text": "The extracted OCR text...",
  "quiz": "[{\"question\": \"...\", \"options\": [\"A. ...\", \"B. ...\", \"C. ...\", \"D. ...\"], \"answer\": \"A\"}]"
}
```

---

## 📄 License

This project is for educational purposes.
