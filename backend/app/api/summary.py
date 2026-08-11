from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.rag.retriever import search_similar_chunks
from app.ai.groq_service import generate_answer


router = APIRouter(
    prefix="/api/summary",
    tags=["AI Summary"]
)


class SummaryRequest(BaseModel):
    paper_id: str


@router.post("/generate")
async def generate_summary(request: SummaryRequest):

    try:
        results = search_similar_chunks(
            question=(
                "What is the main objective, methodology, "
                "key findings, conclusion, and future research "
                "direction of this paper?"
            ),
            paper_id=request.paper_id,
            top_k=15
        )

        if not results:
            raise HTTPException(
                status_code=404,
                detail="No relevant paper content found"
            )

        context = "\n\n".join(
            result["chunk"]
            for result in results
        )

        prompt = """
        You are SciNova AI, a scientific research assistant.

        Analyze the research paper context below and create a useful
        structured summary.

        Return ONLY valid JSON using exactly this structure:

        {{
        "objective": "Clearly explain the main objective of the research.",
        "methodology": "Explain how the research or proposed system works.",
        "keyFindings": [
            "Important finding from the paper",
            "Another important finding from the paper"
        ],
        "conclusion": "Explain the main conclusion.",
        "futureDirections": [
            "Future research direction mentioned or reasonably supported by the paper",
            "Another future direction supported by the paper"
        ]
        }}

        IMPORTANT RULES:

        1. Use ONLY information supported by the research paper context.
        2. Do NOT invent experimental results, statistics, or claims.
        3. If a section is not explicitly stated, derive it carefully from
           the methodology, results, conclusion, or stated limitations.
        4. keyFindings should contain at least 2 useful points when the
           context supports them.
        5. futureDirections should contain useful future-work points when
           the context supports them.
        6. Keep each point concise.
        7. Do not use Markdown.
        8. Return ONLY JSON.

        Research Paper Context:

        {context}
        """

        answer = generate_answer(
            question=prompt,
            context=context
        )

        return {
            "success": True,
            "paper_id": request.paper_id,
            "summary": answer
        }

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )