from app.rag.process_paper import process_paper


result = process_paper(
    "uploads/sample.pdf",
    "test-paper-001"
)

print(result)