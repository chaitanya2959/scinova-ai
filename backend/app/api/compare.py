import json
import re

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.rag.retriever import search_similar_chunks
from app.ai.groq_service import generate_answer


router = APIRouter(
    prefix="/api/compare",
    tags=["Paper Comparison"]
)


class CompareRequest(BaseModel):
    paper_ids: list[str]


def _extract_comparison_json(answer):

    if isinstance(answer, dict):
        return answer

    if not isinstance(answer, str):
        raise ValueError("AI returned unsupported comparison format")

    cleaned = answer.strip()

    if cleaned.startswith("```"):
        cleaned = re.sub(
            r"^```(?:json)?\s*",
            "",
            cleaned,
            flags=re.IGNORECASE
        )
        cleaned = re.sub(
            r"\s*```$",
            "",
            cleaned
        )

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", cleaned, re.DOTALL)
        if match:
            return json.loads(match.group(0))
        raise


@router.post("/")
async def compare_papers(request: CompareRequest):

    if len(request.paper_ids) < 2:
        raise HTTPException(
            status_code=400,
            detail="At least 2 papers are required"
        )

    if len(request.paper_ids) > 3:
        raise HTTPException(
            status_code=400,
            detail="Maximum 3 papers can be compared"
        )

    try:

        paper_contexts = []

        for paper_id in request.paper_ids:

            results = search_similar_chunks(
                question=(
                    "What are the objective, methodology, "
                    "technology, findings, limitations, "
                    "and conclusion of this paper?"
                ),
                paper_id=paper_id,
                top_k=6
            )

            if not results:
                raise HTTPException(
                    status_code=404,
                    detail=f"No content found for paper {paper_id}"
                )

            context = "\n\n".join(
                result["chunk"]
                for result in results
            )

            paper_contexts.append(
                f"""
PAPER ID: {paper_id}

{context}
"""
            )

        all_context = "\n\n".join(
            paper_contexts
        )

        prompt = f"""
You are SciNova AI, a scientific research comparison assistant.

Compare the research papers provided below.

Return ONLY valid JSON using this structure:

{{
  "objectives": "Compare the objectives of the papers.",
  "methodologies": "Compare the methodologies.",
  "technologies": "Compare technologies or approaches used.",
  "findings": "Compare the key findings.",
  "limitations": "Compare stated limitations.",
  "similarities": [
    "Similarity 1",
    "Similarity 2"
  ],
  "differences": [
    "Difference 1",
    "Difference 2"
  ],
  "researchOpportunities": [
    "Research opportunity 1",
    "Research opportunity 2"
  ]
}}

Rules:

1. Use only information supported by the provided paper context.
2. Do not invent experimental results.
3. Clearly distinguish each paper where necessary.
4. Identify meaningful similarities and differences.
5. Research opportunities must be based on gaps or limitations
   visible in the provided papers.
6. Do not use Markdown.
7. Return ONLY valid JSON.

PAPER CONTEXT:

{all_context}
"""

        answer = generate_answer(
            question=prompt,
            context=all_context
        )

        comparison = _extract_comparison_json(answer)

        if isinstance(comparison, dict) and "comparison" in comparison:
            comparison = comparison["comparison"]

        return {
            "success": True,
            "paper_ids": request.paper_ids,
            "comparison": comparison
        }

    except HTTPException:
        raise

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )
