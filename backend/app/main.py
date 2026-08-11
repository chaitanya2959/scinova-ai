from fastapi import FastAPI

from app.api.pdf import router as pdf_router
from app.api.chat import router as chat_router
from app.api.process import router as process_router
from app.api.summary import router as summary_router
from app.api.gap import router as gap_router
from app.api.compare import router as compare_router


app = FastAPI(
    title="SciNova AI Service",
    description="AI service for scientific research analysis",
    version="1.0.0"
)


app.include_router(pdf_router)
app.include_router(chat_router)
app.include_router(process_router)
app.include_router(summary_router)
app.include_router(gap_router)
app.include_router(compare_router)


@app.get("/")
def root():
    return {
        "success": True,
        "message": "SciNova AI Service is running 🚀"
    }


@app.get("/health")
def health():
    return {
        "success": True,
        "service": "AI Service",
        "status": "healthy"
    }