from fastapi import FastAPI, UploadFile, Form, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from ocr import extract_text_from_image
# from quiz_generator import generate_mcq_from_text
from gemini_service import generate_mcqs_from_text

import os
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/")
def home():
    return {"message": "Backend is running"}


@app.post("/generate-quiz")
async def generate_quiz(
    image: UploadFile = File(...),
    language: str = Form(...),
    num_questions: int = Form(5)
):
    # Save image
    image_path = os.path.join(UPLOAD_DIR, image.filename)
    with open(image_path, "wb") as f:
        f.write(await image.read())

    # OCR
    extracted_text = extract_text_from_image(image_path)

    print("****EXTRACTED TEXT****************"+ extracted_text)
    print("***************************************************")
    print("**********LANGUAGE*********************"+language)

    # Check if OCR returned meaningful text
    cleaned = extracted_text.strip()
    if len(cleaned) < 10:
        return JSONResponse(content={
            "error": "No readable text found in the image. Please upload a clear image of text (e.g. textbook page, notes, or article)."
        })

    # Generate quiz
    raw_response = generate_mcqs_from_text(cleaned, language, num_questions)

    # Parse and validate the Gemini response
    try:
        # Strip markdown code fences if present
        clean_response = raw_response.strip()
        if clean_response.startswith("```"):
            clean_response = clean_response.split("\n", 1)[1] if "\n" in clean_response else clean_response[3:]
        if clean_response.endswith("```"):
            clean_response = clean_response[:-3]
        clean_response = clean_response.strip()

        parsed = json.loads(clean_response)

        # Check if Gemini returned an error object
        if isinstance(parsed, dict) and "error" in parsed:
            return JSONResponse(content={"error": parsed["error"]})

        # Validate it's a proper quiz array
        if not isinstance(parsed, list) or len(parsed) == 0:
            return JSONResponse(content={
                "error": "Could not generate quiz from this image. Please upload an image with more readable text content."
            })

        # Validate each question has required fields
        for q in parsed:
            if not all(k in q for k in ("question", "options", "answer")):
                return JSONResponse(content={
                    "error": "Could not generate a proper quiz. Please try again with a clearer text image."
                })

        return {
            "extracted_text": extracted_text,
            "quiz": json.dumps(parsed)
        }

    except (json.JSONDecodeError, Exception) as e:
        print(f"Failed to parse Gemini response: {e}")
        print(f"Raw response: {raw_response}")
        return JSONResponse(content={
            "error": "Could not generate quiz from this image. The text may not be clear enough. Please upload a different image with readable text."
        })
