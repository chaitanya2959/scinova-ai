from app.services.pdf_service import extract_pdf_text
from app.rag.chunker import split_text
from app.rag.embeddings import create_embeddings
from app.rag.vector_store import create_vector_store


def process_paper(
    file_path: str,
    paper_id: str
):

    # 1. Extract text
    text = extract_pdf_text(file_path)

    if not text.strip():
        raise ValueError(
            "No readable text found in PDF"
        )

    # 2. Split text
    chunks = split_text(text)

    if not chunks:
        raise ValueError(
            "Could not create text chunks"
        )

    # 3. Create embeddings
    embeddings = create_embeddings(chunks)

    # 4. Store vectors
    vector_info = create_vector_store(
        chunks,
        embeddings,
        paper_id
    )

    return {
        "characters": len(text),
        "chunks": len(chunks),
        "vector_store": vector_info
    }