from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import easyocr
import datetime
from PIL import Image
import io
import numpy as np
import re

app = FastAPI()
reader = easyocr.Reader(['en'])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/verify-age/")
async def verify_age(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        text_results = reader.readtext(np.array(image), detail=0, paragraph=True)
        text = " ".join(text_results)

        match = re.search(r'(\d{2,4}[-/\.]\d{2}[-/\.]\d{2,4})', text)
        
        dob = None
        
        if match:
            dob_raw = match.group(1).replace(".", "-").replace("/", "-")
            dob_parts = dob_raw.split("-")
            dob = datetime.date(int(dob_parts[2]), int(dob_parts[1]), int(dob_parts[0]))
        
        else:
            # Try to match format like "21 Jan 1995"
            match_alt = re.search(r'(\d{1,2})\s+([A-Za-z]{3,9})\s+(\d{4})', text)
            if match_alt:
                day, month_str, year = match_alt.groups()
                try:
                    dob = datetime.datetime.strptime(f"{day} {month_str} {year}", "%d %b %Y").date()
                except ValueError:
                    try:
                        dob = datetime.datetime.strptime(f"{day} {month_str} {year}", "%d %B %Y").date()
                    except ValueError:
                        return {"valid": False, "reason": "Unable to parse textual date format"}

        if not dob:
            return {"valid": False, "reason": "DOB not found"}

        today = datetime.date.today()
        age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))

        return {
            "valid": age >= 18,
            "dob": str(dob),
            "age": age,
            "extracted_text": text
        }


    except Exception as e:
        return {"error": str(e)}
