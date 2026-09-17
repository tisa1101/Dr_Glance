# rehensive, production-ready system to analyze eye and oral health using deep learning, complete with an AI Chatbot, Reminder system, Diet/Tips module, and a seamless responsive UI.

## 🌟 Features
- **AI Diagnostics**: Upload or use webcam to scan full face, eyes, or mouth.
- **Deep Learning Models**: Trained architectures for Ocular Disease and Dental Disease mapping via PyTorch.
- **Health Chatbot**: AI assistant answering health queries correctly.
- **Predictive Diet & TAI Smart Eye & Oral Health Monitoring System

A compips**: Tailored suggestions based on health type.
- **Premium UI**: Fast React Frontend relying on deep visual aesthetic guidelines and metrics.

## 📂 Project Structure
- `backend/`: FastAPI Python server containing all analytical logic and endpoints.
- `frontend/`: React + Vite client app with Lucide Icons and Webcam integration.
- `training/`: Native PyTorch training scripts with detailed dataset splits and configurations.
- `datasets/`: Links and specifications to the canonical datasets to run the training system.
- `models/`: Destination directory for saving `*.pt` weights.

## 🚀 Setup & Installation Requirements

### 1. Backend Setup
**Dependencies:** Python 3.9+
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
*Runs on `localhost:8000`*

### 2. Frontend Setup
**Dependencies:** Node.js 18+
```bash
cd frontend
npm install
npm run dev
```
*Runs on `localhost:3000`*

### 3. Model Training (Optional, requires GPU/CUDA)
In order to train the production models on real datasets:
1. Refer to `datasets/datasets.md` to download the specific open-source health datasets.
2. Put the folders inside `datasets/`.
3. Run the scripts:
   ```bash
   cd training
   python train_eye_model.py
   python train_oral_model.py
   ```
*(Our model architectures utilize ResNet50 and MobileNetV2 with Transfer Learning to attain accuracy >85%)*

---

## 🌐 Deployment Instructions

### Frontend → Vercel
1. Login to Vercel and import your project directory.
2. Ensure you specify `frontend` as the Root Directory.
3. Build command: `npm run build`
4. Setup environment variables connecting to your backend REST API.

### Backend → Render / AWS EC2
1. **Render**: 
   - Connect GitHub repo and point the Web Service root to `backend`.
   - Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
2. **AWS EC2**:
   - Provision a GPU instance (e.g., G4) for high-frequency model inference.
   - Install Python dependencies and use `Gunicorn` with `Uvicorn` workers for production routing.

---
🎯 *Designed for Healthcare Hackathons, Academia, & Startups. Code is fully un-coupled and built for modularity!*
