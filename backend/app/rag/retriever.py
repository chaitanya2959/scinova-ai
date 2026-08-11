import os
import faiss
import numpy as np

from sentence_transformers import SentenceTransformer


MODEL_NAME = "all-MiniLM-L6-v2"

embedding_model = SentenceTransformer(MODEL_NAME)


def load_chunks(chunks_path: str):
    with open(chunks_path, "r", encoding="utf-8") as file:
        return [line.strip() for line in file if line.strip()]


def search_similar_chunks(
    question: str,
    paper_id: str,
    top_k: int = 3
):
    index_path = os.path.join(
        "vectors",
        f"{paper_id}.index"
    )

    chunks_path = os.path.join(
        "vectors",
        f"{paper_id}.txt"
    )

    if not os.path.exists(index_path):
        raise FileNotFoundError("Vector index not found")

    if not os.path.exists(chunks_path):
        raise FileNotFoundError("Chunks file not found")

    index = faiss.read_index(index_path)

    chunks = load_chunks(chunks_path)

    question_embedding = embedding_model.encode(
        [question],
        convert_to_numpy=True
    ).astype("float32")

    distances, indices = index.search(
        question_embedding,
        min(top_k, len(chunks))
    )

    results = []

    for distance, index_id in zip(
        distances[0],
        indices[0]
    ):
        if index_id < 0:
            continue

        results.append({
            "chunk": chunks[index_id],
            "distance": float(distance)
        })

    return results