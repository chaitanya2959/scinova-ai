import os

from fastapi import APIRouter, UploadFile, File, HTTPException

from app.services.pdf_service import extract_pdf_text


router = APIRouter(
    prefix="/api/pdf",
    tags=["PDF"]
)


@router.post("/extract")
async def extract_pdf(file: UploadFile = File(...)):

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed"
        )

    upload_dir = "uploads"

    os.makedirs(upload_dir, exist_ok=True)

    file_path = os.path.join(upload_dir, file.filename)

    contents = await file.read()

    with open(file_path, "wb") as buffer:
        buffer.write(contents)

    try:
        text = extract_pdf_text(file_path)

        if not text.strip():
            raise HTTPException(
                status_code=400,
                detail="No readable text found in PDF"
            )

        return {
            "success": True,
            "filename": file.filename,
            "characters": len(text),
            "text": text
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )