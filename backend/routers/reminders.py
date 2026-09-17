from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

class Reminder(BaseModel):
    id: int
    title: str
    time: str
    type: str

# In-memory storage for MVP
reminders_db = [
    {"id": 1, "title": "Drink Water", "time": "09:00", "type": "general"},
    {"id": 2, "title": "20-20-20 Eye Break", "time": "14:00", "type": "eye"},
    {"id": 3, "title": "Brush Teeth", "time": "22:00", "type": "oral"}
]

@router.get("/")
def get_reminders():
    return {"reminders": reminders_db}

@router.post("/")
def add_reminder(reminder: Reminder):
    reminders_db.append(reminder.dict())
    return {"message": "Reminder added successfully", "reminders": reminders_db}

@router.delete("/{id}")
def delete_reminder(id: int):
    global reminders_db
    reminders_db = [r for r in reminders_db if r["id"] != id]
    return {"message": "Reminder deleted successfully", "reminders": reminders_db}
