from app.rag.retriever import search_similar_chunks
from app.ai.groq_service import generate_answer


def answer_question(
    question: str,
    paper_id: str
):

    results = search_similar_chunks(
        question=question,
        paper_id=paper_id,
        top_k=3
    )

    if not results:
        return {
            "answer": "I could not find relevant information in the paper.",
            "sources": []
        }

    context = "\n\n".join(
        result["chunk"]
        for result in results
    )

    answer = generate_answer(
        question=question,
        context=context
    )

    return {
        "answer": answer,
        "sources": results
    }