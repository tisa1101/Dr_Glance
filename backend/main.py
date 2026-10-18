from fastapi import FastAPI, UploadFile, File, Form, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import io
import cv2
import numpy as np
import base64
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Import internal modules
from routers import analysis, chat, reminders, diet, auth, history, appointments, facilities

app = FastAPI(title="AI Smart Eye & Oral Health Monitoring API")

# Setup CORS — allow origins from env, fallback to allow all for easy cloud deployment
ALLOWED_ORIGINS_RAW = os.getenv("ALLOWED_ORIGINS", "*")
ALLOWED_ORIGINS = [o.strip() for o in ALLOWED_ORIGINS_RAW.split(",")] if ALLOWED_ORIGINS_RAW != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include modules
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(history.router, prefix="/api/history", tags=["History"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["Analysis"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chatbot"])
app.include_router(reminders.router, prefix="/api/reminders", tags=["Reminders"])
app.include_router(diet.router, prefix="/api/diet", tags=["Diet & Tips"])
app.include_router(appointments.router, prefix="/api/appointments", tags=["Appointments"])
app.include_router(facilities.router, prefix="/api/facilities", tags=["Facilities"])

@app.get("/")
def read_root():
    return {"message": "Welcome to AI Smart Eye & Oral Health Monitoring System API"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
