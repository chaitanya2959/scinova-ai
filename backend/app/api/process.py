import os

from fastapi import APIRouter, UploadFile, File, Form, HTTPException

from app.rag.process_paper import process_paper


router = APIRouter(
    prefix="/api/pdf",
    tags=["PDF Processing"]
)


@router.post("/process")
async def process_pdf(
    file: UploadFile = File(...),
    paper_id: str = Form(...)
):

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed"
        )

    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)

    file_path = os.path.join(
        upload_dir,
        f"{paper_id}_{file.filename}"
    )

    try:
        contents = await file.read()

        with open(file_path, "wb") as buffer:
            buffer.write(contents)

        result = process_paper(
            file_path=file_path,
            paper_id=paper_id
        )

        return {
            "success": True,
            "message": "Paper processed successfully",
            "paper_id": paper_id,
            "filename": file.filename,
            "result": result
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )