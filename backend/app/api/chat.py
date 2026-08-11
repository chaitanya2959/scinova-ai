from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.chat_service import answer_question


router = APIRouter(
    prefix="/api/chat",
    tags=["AI Chat"]
)


class ChatRequest(BaseModel):
    question: str
    paper_id: str


@router.post("/ask")
async def ask_question(request: ChatRequest):

    if not request.question.strip():
        raise HTTPException(
            status_code=400,
            detail="Question is required"
        )

    try:

        result = answer_question(
            question=request.question,
            paper_id=request.paper_id
        )

        return {
            "success": True,
            **result
        }

    except FileNotFoundError as error:

        raise HTTPException(
            status_code=404,
            detail=str(error)
        )

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )