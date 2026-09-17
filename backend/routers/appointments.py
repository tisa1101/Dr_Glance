from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

router = APIRouter()

class AppointmentBooking(BaseModel):
    user_email: str
    user_name: str
    doctor_name: str
    doctor_specialty: str
    date: str
    time: str
    appointment_type: str
    reason: str

def send_confirmation_email(booking: AppointmentBooking):
    # SMTP Configuration (should be in .env)
    # For now, we use placeholders. User needs to fill these in .env
    SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USERNAME = os.getenv("SMTP_USERNAME")
    SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
    SENDER_EMAIL = os.getenv("SENDER_EMAIL", SMTP_USERNAME)

    if not SMTP_USERNAME or not SMTP_PASSWORD:
        print(f"SMTP credentials not found. Email to {booking.user_email} would have been: Confirmation for {booking.doctor_name}")
        return

    try:
        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = booking.user_email
        msg['Subject'] = f"Appointment Confirmation - Dr. Glance AI"

        body = f"""
        Hello {booking.user_name},

        Your appointment has been successfully booked via Dr. Glance AI.

        Details:
        Doctor: {booking.doctor_name} ({booking.doctor_specialty})
        Date: {booking.date}
        Time: {booking.time}
        Type: {booking.appointment_type}
        Reason: {booking.reason}

        Please arrive 10 minutes early.

        Regards,
        Dr. Glance AI Team
        """
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
        print(f"Email sent successfully to {booking.user_email}")
    except Exception as e:
        print(f"Failed to send email: {e}")

@router.post("/book")
async def book_appointment(booking: AppointmentBooking, background_tasks: BackgroundTasks):
    # Here you would typically save to database
    # For now, we just trigger the email
    
    background_tasks.add_task(send_confirmation_email, booking)
    
    return {"message": "Appointment booked successfully. Confirmation email is being sent."}
