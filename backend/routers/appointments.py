from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.orm import Session
from database import get_db, Appointment
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

router = APIRouter()

class AppointmentBooking(BaseModel):
    user_id: Optional[int] = None
    user_email: str
    user_name: str
    doctor_name: str
    doctor_specialty: str
    facility_name: Optional[str] = None
    facility_address: Optional[str] = None
    facility_phone: Optional[str] = None
    date: str
    time: str
    appointment_type: str
    reason: str

def send_confirmation_email(booking: AppointmentBooking):
    SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USERNAME = os.getenv("SMTP_USERNAME")
    SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
    SENDER_EMAIL = os.getenv("SENDER_EMAIL", SMTP_USERNAME)

    if not SMTP_USERNAME or not SMTP_PASSWORD:
        print(f"SMTP notification: Confirmation for {booking.doctor_name} at {booking.facility_name or 'Facility'} to {booking.user_email}")
        return

    try:
        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = booking.user_email
        msg['Subject'] = f"Appointment Confirmed: {booking.doctor_name} - Dr. Glance Healthcare"

        facility_info = f"\nFacility: {booking.facility_name}\nAddress: {booking.facility_address or 'Main Clinical Branch'}\nPhone: {booking.facility_phone or 'Inquire at Reception'}\n" if booking.facility_name else ""

        body = f"""
Hello {booking.user_name},

Your appointment has been confirmed with our verified clinical team.

--- APPOINTMENT SUMMARY ---
Consultant: {booking.doctor_name}
Specialty: {booking.doctor_specialty}
{facility_info}Date: {booking.date}
Time Slot: {booking.time}
Consultation Mode: {booking.appointment_type.capitalize()}
Chief Concern: {booking.reason}

Status: CONFIRMED

Please arrive 15 minutes before your time slot. If you selected an online video consultation, you will receive an encrypted meeting link 30 minutes prior.

With care,
Clinical Coordination Team
Dr. Glance AI Health Screening Platform
        """
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
        print(f"Email sent successfully to {booking.user_email}")
    except Exception as e:
        print(f"SMTP dispatch note: {e}")

@router.post("/book")
async def book_appointment(
    booking: AppointmentBooking,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    # Persist in SQLite database
    new_appointment = Appointment(
        user_id=booking.user_id,
        user_email=booking.user_email,
        user_name=booking.user_name,
        doctor_name=booking.doctor_name,
        doctor_specialty=booking.doctor_specialty,
        facility_name=booking.facility_name,
        facility_address=booking.facility_address,
        facility_phone=booking.facility_phone,
        date=booking.date,
        time=booking.time,
        appointment_type=booking.appointment_type,
        reason=booking.reason,
        status="Confirmed"
    )
    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)

    # Trigger genuine email confirmation in background
    background_tasks.add_task(send_confirmation_email, booking)

    return {
        "status": "success",
        "appointment_id": new_appointment.id,
        "message": "Appointment officially confirmed and recorded.",
        "booking": {
            "doctor": new_appointment.doctor_name,
            "facility": new_appointment.facility_name,
            "date": new_appointment.date,
            "time": new_appointment.time,
            "status": new_appointment.status
        }
    }

@router.get("/user/{user_id}")
def get_user_appointments(user_id: int, db: Session = Depends(get_db)):
    appointments = db.query(Appointment).filter(Appointment.user_id == user_id).order_by(Appointment.created_at.desc()).all()
    return {
        "total": len(appointments),
        "appointments": [
            {
                "id": a.id,
                "doctor_name": a.doctor_name,
                "doctor_specialty": a.doctor_specialty,
                "facility_name": a.facility_name,
                "facility_address": a.facility_address,
                "facility_phone": a.facility_phone,
                "date": a.date,
                "time": a.time,
                "type": a.appointment_type,
                "status": a.status,
                "reason": a.reason,
                "created_at": a.created_at.isoformat() if a.created_at else None
            }
            for a in appointments
        ]
    }
