# Dr. Glance — Clinical AI-Assisted Eye & Oral Screening Platform

[![Vite](https://img.shields.io/badge/Vite-4.5-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.16-FF6F00?style=flat&logo=tensorflow&logoColor=white)](https://tensorflow.org/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?style=flat&logo=leaflet&logoColor=white)](https://leafletjs.com/)

> **Dr. Glance** is a clinical AI-assisted wellness screening platform combining computer-vision inferences, pixel-level heuristic oral inspection, multimodal symptom matching, and real verified healthcare facilities mapping.

---

## 🌟 Key Capabilities

- **AI Ocular Diagnostics:** Automated screening for 6 conditions (*Cataracts, Glaucoma, Uveitis, Bulging Eyes, Crossed Eyes, Healthy*) via transfer-learned **MobileNetV2**.
- **Oral Health Heuristics:** Pixel-level computer vision inspection analyzing LAB gum redness ratios, dental discoloration, and plaque markers.
- **Multimodal AI Doctor Assessment:** Synthesizes image inferences with patient-selected symptoms using a structured 21-rule clinical safety framework.
- **Verified Clinical Map:** Interactive dark-mode OpenStreetMap showing real verified hospitals, chief consultants, and emergency phone lines with smooth camera panning.
- **Persistent Booking Engine:** Relational SQLite appointment booking with automated email dispatch and patient status tracking.
- **Health History & Trends:** Interactive AreaChart tracking model confidence progression over time with category filters.
- **AI Health Assistant:** Floating chatbot modal for wellness guidance with keyboard navigation and accessible focus management.

---

## 🏗️ System Architecture

```
DRGLANCE/
├── frontend/                     # React 18 + Vite SPA
│   ├── src/
│   │   ├── components/           # DoctorMap, BookingModal, Chatbot, UI library
│   │   ├── pages/                # Dashboard, Diagnostics, History, Appointments, SymptomChecker
│   │   ├── config/api.js         # Centralized API configuration (dev proxy + env var)
│   │   └── index.css             # Ocean Cyan & Mint Emerald design tokens & animations
│   ├── vercel.json               # Vercel SPA routing
│   └── netlify.toml              # Netlify SPA routing
│
├── backend/                      # FastAPI Python REST API
│   ├── routers/
│   │   ├── analysis.py           # MobileNetV2 inferences & clinical report generator
│   │   ├── facilities.py         # Real verified hospitals & specialist registry
│   │   ├── appointments.py       # DB booking persistence & automated email dispatch
│   │   ├── history.py            # Patient scan logs & 30-day confidence metrics
│   │   ├── chat.py               # AI health conversational engine
│   │   ├── auth.py               # Authentication & user sessions
│   │   ├── reminders.py          # Wellness routine scheduler
│   │   └── diet.py               # Eye & oral superfood recommendations
│   ├── database.py               # SQLAlchemy SQLite engine & models
│   ├── models/                   # Saved model weights (eye_health_classifier.h5)
│   └── main.py                   # App entrypoint, dynamic PORT & CORS config
```

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Python 3.10+ (tested on 3.12)
- Node.js 18+ & npm

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation will be live at `http://localhost:8000/docs`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Client application will be accessible at `http://localhost:3000`.

---

## 🌐 Cloud Deployment Guide

### Deploy Backend → Render.com (Free)
1. Sign in to [Render.com](https://render.com/) with GitHub.
2. Click **New +** → **Web Service** → Select `Dr_Glance`.
3. Set the following:
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add Environment Variables:
   - `ALLOWED_ORIGINS`: `*`
   - `SMTP_USERNAME`: `your-email@gmail.com`
   - `SMTP_PASSWORD`: `your-gmail-app-password`
5. Click **Deploy Web Service** and copy your live URL (`https://your-api.onrender.com`).

### Deploy Frontend → Vercel (Free)
1. Sign in to [Vercel.com](https://vercel.com/) with GitHub.
2. Click **Add New...** → **Project** → Import `Dr_Glance`.
3. Configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** `Vite`
4. Add Environment Variable:
   - **Key:** `VITE_API_BASE_URL`
   - **Value:** Your live Render URL (`https://your-api.onrender.com`)
5. Click **Deploy** to receive your live production URL.

---

## ⚖️ Clinical Disclaimer
*Dr. Glance is an experimental AI-assisted digital health screening prototype designed for wellness exploration. It does not provide medical diagnoses or replace licensed clinical consultations. Model confidence scores reflect computational pattern compatibility and do not equate to clinical certainty.*
