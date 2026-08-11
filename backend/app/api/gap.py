from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.rag.retriever import search_similar_chunks
from app.ai.groq_service import generate_answer


router = APIRouter(
    prefix="/api/gap",
    tags=["Research Gap"]
)


class GapRequest(BaseModel):
    paper_id: str


@router.post("/analyze")
async def analyze_gap(request: GapRequest):

    try:
        results = search_similar_chunks(
            question=(
                "Identify the research gaps, limitations, "
                "missing areas, weaknesses, unresolved problems, "
                "future opportunities, and possible research "
                "directions discussed or implied by this paper."
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

        prompt = f"""
You are SciNova AI, an advanced scientific research assistant.

Analyze the research paper context below.

Return ONLY valid JSON in exactly this structure:

{{
  "gaps": [
    "Research gap 1",
    "Research gap 2"
  ],
  "limitations": [
    "Limitation 1",
    "Limitation 2"
  ],
  "missingAreas": [
    "Missing area 1",
    "Missing area 2"
  ],
  "opportunities": [
    "Research opportunity 1",
    "Research opportunity 2"
  ],
  "researchDirections": [
    "Suggested research direction 1",
    "Suggested research direction 2"
  ]
}}

Rules:

1. Use the paper context as the primary source.
2. Do not invent experimental results.
3. Clearly distinguish explicitly stated limitations from
   reasonable research opportunities.
4. Do not claim something is a limitation unless the paper
   supports it.
5. Keep each item concise.
6. Return useful points instead of empty arrays when the
   context provides supporting information.
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
            "analysis": answer
        }

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )