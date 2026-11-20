import os
import zipfile

def create_submission_zip():
    zip_filename = "DRGLANCE_Consolidated_Submission.zip"
    base_dir = os.path.dirname(os.path.abspath(__file__))

    # Excluded directories and file patterns
    excluded_dirs = {'.venv', 'node_modules', '.git', '__pycache__', 'dist', '.gemini'}
    excluded_exts = {'.pyc', '.pyo', '.zip'}

    # Create/update SUBMISSION_METADATA.txt
    metadata_content = """========================================================================
DRGLANCE: CLINICAL AI BIOMETRICS SCREENING PLATFORM
CONSOLIDATED CAPSTONE / FINAL PROJECT SUBMISSION
========================================================================

Candidate / Author: Tisa Bhattacharya
Project Title: DRGLANCE — Deep Learning Clinical Screening for Ocular & Oral Biometrics
GitHub Repository URL: https://github.com/tisa1101/Dr_Glance.git
Live Cloud Deployment: Vercel Edge Client + Render ASGI Engine

ARCHIVE CONTENTS:
1. Finalized Project Report:
   - DRGLANCE_Final_Project_Report.md (Complete IEEE / Capstone 8-Chapter Report)
2. Presentation Decks:
   - DRGLANCE_Clinical_AI_Presentation.pptx (Native 16:9 PowerPoint with Speaker Notes)
   - DRGLANCE_Interactive_Presentation.html (Interactive Full-Screen Presentation Runner)
3. Master Submission & Defense Prompts:
   - MASTER_PROJECT_REPORT_PROMPT.md (LaTeX, Thesis, and Viva Grill Prompts)
4. Complete Executable Source Code:
   - backend/ (FastAPI ASGI Engine, Routers, Database Models)
   - frontend/ (React 18 + Vite SPA, ŌURA Bio-Wellness Design System)
   - training/ (Keras/TensorFlow Training Pipelines for MobileNetV2 & ResNet50)
   - models/ (Model weights and saved neural checkpoints)
   - chatbot/, reminders/, utils/ (Auxiliary clinical modules)
   - README.md (Comprehensive setup & reproduction guide)

QUICK EXECUTION:
- Backend: cd backend && pip install -r requirements.txt && uvicorn main:app --reload
- Frontend: cd frontend && npm install && npm run dev
- API Documentation: http://localhost:8000/docs
- Frontend URL: http://localhost:3000
========================================================================
"""
    with open(os.path.join(base_dir, "SUBMISSION_METADATA.txt"), "w", encoding="utf-8") as f:
        f.write(metadata_content)

    print(f"Creating {zip_filename}...")
    with zipfile.ZipFile(os.path.join(base_dir, zip_filename), 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(base_dir):
            # Prune excluded directories
            dirs[:] = [d for d in dirs if d not in excluded_dirs]

            for file in files:
                if file == zip_filename:
                    continue
                ext = os.path.splitext(file)[1].lower()
                if ext in excluded_exts:
                    continue
                
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, base_dir)

                # Skip root virtual environments or cache files
                if any(ex in rel_path.split(os.sep) for ex in excluded_dirs):
                    continue

                zipf.write(full_path, rel_path)

    zip_size_mb = os.path.getsize(os.path.join(base_dir, zip_filename)) / (1024 * 1024)
    print(f"Success! {zip_filename} created ({zip_size_mb:.2f} MB).")

if __name__ == "__main__":
    create_submission_zip()
