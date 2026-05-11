import easyocr

# Load OCR model (FREE, OFFLINE)
reader = easyocr.Reader(['en'])

def extract_text_from_image(image_path: str) -> str:
    """
    Takes image path and returns extracted text
    """
    result = reader.readtext(image_path, detail=0)
    extracted_text = " ".join(result)
    print(extracted_text)
    return extracted_text
