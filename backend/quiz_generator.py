def generate_mcq_from_text(text: str, language: str):
    """
    Convert extracted text into MCQs
    (For now: simple rule-based demo)
    """

    quiz = [
        {
            "question": f"What is the main topic discussed in the text?",
            "options": [
                text[:40] + "...",
                "Unrelated Option",
                "None of the above",
                "All of the above"
            ],
            "answer": 0,
            "explanation": "The correct answer is taken directly from OCR text."
        }
    ]

    return quiz
