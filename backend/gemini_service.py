import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")

def generate_mcqs_from_text(text: str, language: str, num_questions: int = 5):
    prompt = f"""
You are an expert teacher.

Your task: Analyze the TEXT below and generate {num_questions} multiple-choice questions (MCQs) from it.

IMPORTANT — First check if the text is valid:
- If the text is empty, blank, or contains only whitespace → return error
- If the text is random characters, gibberish, or has no meaningful content → return error
- If the text is too short (less than ~10 meaningful words) to form any quiz questions → return error
- If the text appears to be from a non-text image (e.g. OCR noise from a photo, selfie, landscape, meme, etc.) → return error

If the text is NOT valid, return ONLY this JSON (no extra text):
{{"error": "Could not generate quiz. Please upload an image containing clear, readable text (e.g. textbook page, notes, or article)."}}

If the text IS valid, generate {num_questions} MCQs following these rules:
- Language: {language}
- Each question must have 4 options labeled A, B, C, D
- Mark the correct answer clearly
- Only create questions from the given text, not from outside knowledge
- Output STRICT JSON only, no extra text

JSON format for valid questions:
[
  {{
    "question": "...",
    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
    "answer": "A"
  }}
]

TEXT:
{text}
"""

    response = model.generate_content(prompt)
    return response.text
