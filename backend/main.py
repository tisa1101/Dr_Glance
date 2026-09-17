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

# Import internal modules (we will create these next)
from routers import analysis, chat, reminders, diet, auth, history, appointments

app = FastAPI(title="AI Smart Eye & Oral Health Monitoring API")

# Setup CORS for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev only
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

@app.get("/")
def read_root():
    return {"message": "Welcome to AI Smart Eye & Oral Health Monitoring System API"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
