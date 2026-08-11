import os
import faiss
import numpy as np


VECTOR_DIR = "vectors"


def create_vector_store(chunks, embeddings, paper_id):

    os.makedirs(VECTOR_DIR, exist_ok=True)

    embeddings = np.array(
        embeddings,
        dtype="float32"
    )

    dimension = embeddings.shape[1]

    index = faiss.IndexFlatL2(dimension)

    index.add(embeddings)

    index_path = os.path.join(
        VECTOR_DIR,
        f"{paper_id}.index"
    )

    chunks_path = os.path.join(
        VECTOR_DIR,
        f"{paper_id}.txt"
    )

    faiss.write_index(
        index,
        index_path
    )

    with open(
        chunks_path,
        "w",
        encoding="utf-8"
    ) as file:

        for chunk in chunks:
            file.write(chunk.replace("\n", " ") + "\n")

    return {
        "index_path": index_path,
        "chunks_path": chunks_path,
        "total_chunks": len(chunks)
    }