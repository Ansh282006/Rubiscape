from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Rubiscape ML Pipeline Tracker")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Rubiscape API is running!", "status": "ready"}

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "rubiscape-tracker"}
