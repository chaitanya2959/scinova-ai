import os

from dotenv import load_dotenv
from groq import Groq


load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

MODEL = os.getenv(
    "GROQ_MODEL",
    "llama-3.3-70b-versatile"
)


def generate_answer(
    question: str,
    context: str
):

    prompt = f"""
You are SciNova AI, an AI assistant for scientific research.

Answer the user's question using the provided research-paper context.

Rules:
1. Use the context as the primary source.
2. Do not invent facts that are not supported by the context.
3. If the context does not contain enough information, clearly say so.
4. Give a clear and concise scientific answer.
5. Mention important evidence from the provided context when useful.

Research Paper Context:
{context}

User Question:
{question}

Answer:
"""

    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2,
        max_tokens=1000
    )

    return response.choices[0].message.content