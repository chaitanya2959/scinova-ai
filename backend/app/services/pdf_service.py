import fitz


def extract_pdf_text(file_path: str) -> str:
    """
    Extract text from a PDF file.
    """

    document = fitz.open(file_path)

    pages_text = []

    for page in document:
        text = page.get_text()

        if text.strip():
            pages_text.append(text)

    document.close()

    return "\n\n".join(pages_text)