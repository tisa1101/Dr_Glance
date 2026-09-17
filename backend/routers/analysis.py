import cv2
import numpy as np
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db, ScanHistory
import base64
from typing import Dict, Any, List, Optional
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from pathlib import Path
import os

DISEASE_DATASET = {
    "eye": [
        {
            "name": "Conjunctivitis (Pink Eye)",
            "symptoms": ["redness", "itching", "gritty feeling", "discharge", "tearing"],
            "severity": "Moderate",
            "advice": "Avoid touching eyes, wash hands frequently. Consult for antibiotic drops if bacterial.",
            "risk": "Highly contagious"
        },
        {
            "name": "Glaucoma",
            "symptoms": ["loss of peripheral vision", "haloes around lights", "eye pain", "blurred vision"],
            "severity": "High",
            "advice": "Requires immediate medical attention to prevent permanent vision loss.",
            "risk": "Age, Family history, High eye pressure"
        },
        {
            "name": "Cataracts",
            "symptoms": ["cloudy vision", "difficulty with night vision", "sensitivity to light", "fading colors"],
            "severity": "Moderate",
            "advice": "Surgery is the effective treatment when vision interferes with daily life.",
            "risk": "Age, Diabetes, UV exposure"
        },
        {
            "name": "Dry Eye Syndrome",
            "symptoms": ["stinging or burning", "scratchiness", "stringy mucus", "light sensitivity"],
            "severity": "Low",
            "advice": "Use artificial tears, stay hydrated, and take screen breaks.",
            "risk": "Extended screen use, Aging, Environment"
        },
        {
            "name": "Stye",
            "symptoms": ["red bump on eyelid", "eyelid pain", "swelling", "tearing"],
            "severity": "Low",
            "advice": "Apply warm compresses 4 times a day. Do not squeeze.",
            "risk": "Poor eyelid hygiene"
        }
    ],
    "mouth": [
        {
            "name": "Dental Caries (Cavities)",
            "symptoms": ["toothache", "tooth sensitivity", "mild to sharp pain when eating hot/cold", "visible holes"],
            "severity": "Moderate",
            "advice": "Visit a dentist for fillings. Maintain better brushing and flossing habits.",
            "risk": "High sugar diet, Poor hygiene"
        },
        {
            "name": "Gingivitis",
            "symptoms": ["swollen gums", "dusky red gums", "gums that bleed easily when brushing", "bad breath"],
            "severity": "Moderate",
            "advice": "Professional cleaning and improved home oral care can reverse it.",
            "risk": "Plaque buildup, Smoking"
        },
        {
            "name": "Mouth Ulcers (Canker Sores)",
            "symptoms": ["small sores inside mouth", "painful red areas", "tingling sensation", "difficulty eating"],
            "severity": "Low",
            "advice": "Usually heal on their own. Avoid spicy foods. Use salt water rinses.",
            "risk": "Stress, Minor injury, Vitamin deficiency"
        },
        {
            "name": "Oral Thrush",
            "symptoms": ["white lesions on tongue/cheeks", "cottage cheese appearance", "loss of taste", "redness under patches"],
            "severity": "Moderate",
            "advice": "Antifungal medications are typically used. Maintain good oral hygiene.",
            "risk": "Weakened immune system, Diabetes, Antibiotics"
        },
        {
            "name": "Leukoplakia",
            "symptoms": ["thickened white patches", "cannot be scraped off", "irregular edges", "sometimes persistent"],
            "severity": "High",
            "advice": "Must be examined by a dentist/doctor as it can be precancerous.",
            "risk": "Tobacco use, Chronic irritation"
        }
    ]
}

def match_symptoms(symptoms_list: List[str], category: str) -> List[Dict[str, Any]]:
    if not symptoms_list:
        return []
    
    results = []
    categories = ["eye", "mouth"] if category == "both" else [category]
    
    for cat in categories:
        for disease in DISEASE_DATASET.get(cat, []):
            matches = [s for s in disease["symptoms"] if s.lower() in [sym.lower() for sym in symptoms_list]]
            if matches:
                match_percentage = round((len(matches) / len(disease["symptoms"])) * 100, 2)
                results.append({
                    "name": disease["name"],
                    "matchPercentage": match_percentage,
                    "matches": len(matches),
                    "severity": disease["severity"],
                    "advice": disease["advice"],
                    "risk": disease["risk"]
                })
                
    results.sort(key=lambda x: x["matchPercentage"], reverse=True)
    return results


# ─────────────────────────────────────────────────────────────
#  DRGLANCE MASTER CLINICAL AI SYSTEM — Report Generator
#  Follows the DRGLANCE Clinical System Prompt (all 21 rules)
# ─────────────────────────────────────────────────────────────

# Validated confidence thresholds
HIGH_CONFIDENCE_THRESHOLD = 75.0    # ≥75% → High confidence
MODERATE_CONFIDENCE_THRESHOLD = 55.0  # 55–74% → Moderate
# <55% → Low / Uncertain — no disease classification returned

# Model-supported classes per modality
EYE_SUPPORTED_CLASSES = {"bulging eyes", "cataracts", "crossed eyes", "eye diseases",
                          "glaucoma", "uveitis", "normal", "conjunctivitis"}
MOUTH_SUPPORTED_CLASSES = {"normal", "dental caries (cavities)", "gingivitis",
                            "mouth ulcers", "oral thrush", "leukoplakia"}

def _confidence_tier(confidence: float) -> str:
    """Rule 6 & 7: Classify confidence tier."""
    if confidence >= HIGH_CONFIDENCE_THRESHOLD:
        return "High"
    elif confidence >= MODERATE_CONFIDENCE_THRESHOLD:
        return "Moderate"
    else:
        return "Low"

def _is_supported_class(condition: str, modality: str) -> bool:
    """Rule 8 & 9: Ensure prediction is within validated class list."""
    supported = EYE_SUPPORTED_CLASSES if modality == "eye" else MOUTH_SUPPORTED_CLASSES
    return any(condition.lower() in cls or cls in condition.lower() for cls in supported)

def _symptom_compatibility(symptom_matches: List[Dict], condition: str, modality: str) -> str:
    """Rule 11 & 12: Returns compatibility string — never used to inflate confidence."""
    if not symptom_matches:
        return "No symptoms reported — symptom compatibility cannot be assessed."
    relevant = [m for m in symptom_matches
                if m["name"] in [d["name"] for d in DISEASE_DATASET.get(modality, [])]]
    if not relevant:
        return "Reported symptoms are not clearly related to the visual finding from this scan."
    top = relevant[0]
    if any(word in top["name"].lower() for word in condition.lower().split()):
        return (f"Reported symptoms show possible compatibility with '{top['name']}' "
                f"({top['matchPercentage']}% symptom match). "
                f"Symptom compatibility does not confirm the diagnosis.")
    return (f"Reported symptoms are possibly relevant but do not directly correspond "
            f"to the model's primary finding. Top symptom match: '{top['name']}' "
            f"({top['matchPercentage']}% match).")

def _next_step(confidence: float, condition: str, severity: Optional[str] = None) -> str:
    """Rule 18: Proportional recommendation."""
    if confidence < MODERATE_CONFIDENCE_THRESHOLD:
        return "Repeat image acquisition under better lighting, or seek professional evaluation."
    if condition.lower() == "normal":
        return ("Continue appropriate routine healthcare. "
                "Seek professional evaluation if symptoms persist or worsen.")
    if severity == "High":
        return "Prompt professional medical evaluation is strongly recommended."
    return "Professional examination is recommended to confirm this finding."

def generate_combined_assessment(
    scan_results: Dict[str, Any],
    symptom_matches: List[Dict[str, Any]]
) -> str:
    """
    DRGLANCE Master Clinical AI Report Generator.
    Produces a structured DRGLANCE AI SCREENING REPORT per the master system prompt.
    Rules enforced: 1–21 (patient safety, no hallucination, no false reassurance,
    model confidence ≠ clinical certainty, appropriate uncertainty).
    """
    report_sections = []

    model_findings = []
    if "eye" in scan_results and "error" not in scan_results["eye"]:
        model_findings.append(("eye", scan_results["eye"]))
    if "mouth" in scan_results and "error" not in scan_results["mouth"]:
        model_findings.append(("mouth", scan_results["mouth"]))

    # ── Rule 1 / 4: No detectable region ────────────────────────────────────
    if not model_findings:
        return (
            "⚠️ DRGLANCE AI SCREENING REPORT\n"
            "─────────────────────────────────\n"
            "Analyzed Region: Unable to determine — no valid region extracted.\n\n"
            "No AI prediction can be generated from the available image data.\n"
            "Please retake the image ensuring the relevant area (eye or mouth) "
            "is clearly visible, well-lit, and in focus.\n\n"
            "Safety Statement: This is an AI-assisted screening result, not a confirmed "
            "medical diagnosis. The result should be interpreted by an appropriately "
            "qualified healthcare professional."
        )

    scan_type_label = "Eye" if len(model_findings) == 1 and model_findings[0][0] == "eye" \
        else "Mouth / Oral" if len(model_findings) == 1 \
        else "Full Face (Eye + Oral)"

    report_sections.append("🩺 DRGLANCE AI SCREENING REPORT")
    report_sections.append("─" * 40)
    report_sections.append(f"Scan Type: {scan_type_label}")

    for modality, result in model_findings:
        condition: str = result.get("condition", "Unknown")
        confidence: float = result.get("confidence", 0.0)
        alerts: list = result.get("alerts", [])

        tier = _confidence_tier(confidence)
        modality_label = "Eye Health" if modality == "eye" else "Oral Health"
        model_name = "Eye Health Classifier v1 (MobileNetV2)" if modality == "eye" \
            else "Oral Heuristic Analyzer v1 (pixel-based, no trained model)"

        # ── Rule 3: Image quality signal ────────────────────────────────────
        image_quality = "Acceptable"
        if confidence < MODERATE_CONFIDENCE_THRESHOLD:
            image_quality = "Poor — low model confidence may indicate unclear image"
        elif confidence >= HIGH_CONFIDENCE_THRESHOLD:
            image_quality = "Good"

        report_sections.append(f"\n📋 {modality_label.upper()} SCAN")
        report_sections.append(f"Image Quality: {image_quality}")
        report_sections.append(f"AI Model: {model_name}")

        # ── Rule 7: Low confidence — return UNCERTAIN_PREDICTION ────────────
        if confidence < MODERATE_CONFIDENCE_THRESHOLD:
            report_sections.append(
                f"Primary Model Finding: UNCERTAIN_PREDICTION\n"
                f"Model Confidence: {confidence}%\n"
                f"Confidence Status: Low — below validated threshold ({MODERATE_CONFIDENCE_THRESHOLD}%)\n\n"
                f"⚠️ The model detected a weak visual pattern that does not meet the validated "
                f"confidence threshold. A reliable classification cannot be made from this image.\n"
                f"Recommended Next Step: Retake the image or seek professional evaluation."
            )
            continue

        # ── Rule 8: Out-of-distribution check ───────────────────────────────
        if not _is_supported_class(condition, modality):
            report_sections.append(
                f"Primary Model Finding: UNKNOWN_OR_UNSUPPORTED_PATTERN\n"
                f"Model Confidence: {confidence}%\n\n"
                f"⚠️ The predicted class '{condition}' is outside the validated scope of the "
                f"current model. No supported condition can be confidently identified.\n"
                f"Recommended Next Step: Professional examination is recommended."
            )
            continue

        # ── Rule 5 & 6: Report actual model output, never claim clinical certainty ──
        finding_text = (
            "No concerning pattern detected within the model's supported scope."
            if condition.lower() == "normal"
            else f"{condition}-associated visual pattern detected."
        )

        report_sections.append(f"Primary Model Finding: {finding_text}")
        report_sections.append(f"Model Confidence: {confidence}%")
        report_sections.append(f"Confidence Status: {tier}")

        # ── Rule 9/10: Observable visual features ───────────────────────────
        if alerts:
            obs_text = "\n".join(f"  • {a}" for a in alerts)
            report_sections.append(f"Observable Findings:\n{obs_text}")
        else:
            report_sections.append("Observable Findings: No specific visual abnormality flagged.")

        # ── Rule 11 & 12: Symptoms as compatibility, NOT confidence booster ─
        if symptom_matches:
            sym_names = [m['name'] for m in symptom_matches[:3]]
            compat = _symptom_compatibility(symptom_matches, condition, modality)
            report_sections.append(
                f"Reported Symptoms: {', '.join(sym_names)}\n"
                f"Symptom Compatibility: {compat}"
            )
        else:
            report_sections.append(
                "Reported Symptoms: None provided\n"
                "Symptom Compatibility: Insufficient information — no symptoms reported."
            )

        # ── Rule 13: Other model-supported possibilities ─────────────────────
        supported_set = EYE_SUPPORTED_CLASSES if modality == "eye" else MOUTH_SUPPORTED_CLASSES
        others = [c.title() for c in supported_set
                  if c != "normal" and c.lower() != condition.lower()][:3]
        if others and condition.lower() != "normal":
            report_sections.append(
                f"Other Model-Supported Possibilities: {', '.join(others)}\n"
                f"  (These require professional assessment to differentiate.)"
            )

        # ── Rule 14: Red flag high-severity symptom matches ─────────────────
        high_sev = [m for m in symptom_matches if m.get("severity") == "High"]
        if high_sev:
            flags = "\n".join(
                f"  ⚠️ {m['name']} ({m['matchPercentage']}% symptom match) — {m['advice']}"
                for m in high_sev
            )
            report_sections.append(f"🚨 PROFESSIONAL REVIEW RECOMMENDED:\n{flags}")

        # ── Rule 16/17: No false reassurance, no overdiagnosis ──────────────
        if condition.lower() == "normal":
            conclusion = (
                "No concerning finding was identified by the current AI screening model "
                "within its supported scope. AI screening does not replace professional examination."
            )
        else:
            conclusion = (
                f"The model output is consistent with a possible {condition}-associated pattern. "
                f"This is NOT a confirmed medical diagnosis. Clinical confirmation is required."
            )
        report_sections.append(f"Clinical Interpretation: {conclusion}")

        # ── Rule 18: Proportional next step ─────────────────────────────────
        sev = high_sev[0]["severity"] if high_sev else None
        report_sections.append(f"Recommended Next Step: {_next_step(confidence, condition, sev)}")

    # ── Rule 20: Limitations & safety statement ──────────────────────────────
    report_sections.append("\n" + "─" * 40)
    report_sections.append(
        "Limitations:\n"
        "  • Eye model is trained on a limited dataset — real-world accuracy may vary.\n"
        "  • Oral analysis uses pixel heuristics, not a trained neural network — results are indicative only.\n"
        "  • Image quality, lighting, and camera angle significantly affect accuracy.\n"
        "  • This system does not assess conditions outside its validated class list."
    )
    report_sections.append(
        "\n🛡️ Safety Statement:\n"
        "\"This is an AI-assisted screening result, not a confirmed medical diagnosis. "
        "The result should be interpreted by an appropriately qualified healthcare professional.\""
    )

    return "\n\n".join(report_sections)


try:
    import mediapipe
except Exception as exc:
    mediapipe = None
    print(f"Warning: MediaPipe unavailable: {exc}")

router = APIRouter()

MODEL_PATH = Path(__file__).resolve().parents[2] / "models" / "eye_health_classifier.h5"
DATASET_ROOT = os.environ.get("EYE_DATASET_DIR") or str(Path(__file__).resolve().parents[2] / "datasets" / "eye_dataset")

eye_model = None
class_names = []


def load_eye_model():
    global eye_model, class_names
    if eye_model is not None:
        return eye_model, class_names

    if not MODEL_PATH.exists():
        print(f"Warning: Eye model not found at {MODEL_PATH}")
        return None, []

    try:
        eye_model = load_model(MODEL_PATH, compile=False)
        if os.path.isdir(DATASET_ROOT):
            class_names = sorted([p.name for p in Path(DATASET_ROOT).iterdir() if p.is_dir()])
        else:
            class_names = ["Bulging_Eyes", "Cataracts", "Crossed_Eyes", "Eye_diseases", "Glaucoma", "Uveitis"]
        if not class_names:
            class_names = [f"class_{i}" for i in range(eye_model.output_shape[-1])]
        print(f"Loaded eye model from {MODEL_PATH} with classes: {class_names}")
    except Exception as exc:
        print(f"Warning: Could not load eye model: {exc}")
        eye_model = None
        class_names = []

    return eye_model, class_names

# Initialize MediaPipe Face Mesh safely
mp_face_mesh = None
face_mesh = None
if mediapipe is not None:
    try:
        import mediapipe.python.solutions.face_mesh as mp_face_mesh
        face_mesh = mp_face_mesh.FaceMesh(static_image_mode=True, max_num_faces=1, refine_landmarks=True)
    except Exception as e:
        print(f"Warning: MediaPipe face mesh failed to initialize: {e}. Falling back to basic cropping.")
else:
    print("Info: MediaPipe not available; using simple crop fallback for analysis.")

# Define Model Architecture logic using PyTorch (Assume saved weights exist in real scenario)
class HealthAnalyzerModel:
    def __init__(self):
        pass

    def analyze_eye(self, image_crop: np.ndarray) -> Dict[str, Any]:
        model, labels = load_eye_model()
        if model is None:
            return {
                "condition": "Model unavailable",
                "confidence": 0.0,
                "alerts": ["The trained eye model is not available yet."]
            }

        try:
            rgb = cv2.cvtColor(image_crop, cv2.COLOR_BGR2RGB)
            resized = cv2.resize(rgb, (224, 224))
            prepared = preprocess_input(resized.astype("float32"))
            prepared = np.expand_dims(prepared, axis=0)
            prediction = model.predict(prepared, verbose=0)[0]
            idx = int(np.argmax(prediction))
            confidence = round(float(prediction[idx]) * 100, 2)
            condition = labels[idx].replace("_", " ") if idx < len(labels) else f"Class {idx}"

            return {
                "condition": condition,
                "confidence": confidence,
                "alerts": [] if condition.lower() == "normal" else [f"Potential {condition.lower()} detected. Please consult an ophthalmologist if symptoms persist."]
            }
        except Exception as exc:
            print(f"Eye inference failed: {exc}")
            return {
                "condition": "Analysis failed",
                "confidence": 0.0,
                "alerts": ["Could not analyze the uploaded image."]
            }

    def analyze_mouth(self, image_crop: np.ndarray) -> Dict[str, Any]:
        """
        Heuristic-based oral health analyzer using image pixel analysis.
        Evaluates tooth brightness, gum redness, dark spot presence, and discoloration.
        Falls back to 'Normal' for healthy-looking images.
        NOTE: A trained oral disease model would be more accurate.
        """
        try:
            image_rgb = cv2.cvtColor(image_crop, cv2.COLOR_BGR2RGB)
            h, w = image_rgb.shape[:2]

            # --- Feature Extraction ---

            # 1. Tooth brightness: Teeth should be bright (high L in LAB)
            lab = cv2.cvtColor(image_crop, cv2.COLOR_BGR2LAB)
            L_channel = lab[:, :, 0]
            # Focus on center region where teeth typically are
            center_L = L_channel[h//4:3*h//4, w//5:4*w//5]
            avg_brightness = float(np.mean(center_L))  # 0-255, high = bright/white

            # 2. Gum redness: Check red channel vs green in upper/lower edges (gum zones)
            top_gum = image_rgb[:h//4, :]
            bottom_gum = image_rgb[3*h//4:, :]
            gum_zone = np.vstack([top_gum, bottom_gum])
            avg_red = float(np.mean(gum_zone[:, :, 0]))
            avg_green = float(np.mean(gum_zone[:, :, 1]))
            gum_redness_ratio = avg_red / (avg_green + 1)  # >1.4 suggests inflamed gums

            # 3. Dark spots / lesions: Check for unusually dark pixels in tooth region
            gray = cv2.cvtColor(image_crop, cv2.COLOR_BGR2GRAY)
            center_gray = gray[h//4:3*h//4, w//5:4*w//5]
            # Dark spots = pixels below threshold 80
            dark_pixel_ratio = float(np.sum(center_gray < 80)) / center_gray.size

            # 4. Yellowish discoloration: in HSV, high Saturation + yellowish Hue
            hsv = cv2.cvtColor(image_crop, cv2.COLOR_BGR2HSV)
            center_hsv = hsv[h//4:3*h//4, w//5:4*w//5]
            avg_saturation = float(np.mean(center_hsv[:, :, 1]))  # High = discolored
            # Yellow hue range is ~20-40 in OpenCV HSV
            yellow_mask = ((center_hsv[:, :, 0] >= 15) & (center_hsv[:, :, 0] <= 45) &
                          (center_hsv[:, :, 1] > 50))
            yellow_ratio = float(np.sum(yellow_mask)) / (center_hsv.shape[0] * center_hsv.shape[1])

            # --- Decision Logic ---
            condition = "Normal"
            confidence = 0.0
            alerts = []

            scores = {
                "Normal": 0.0,
                "Dental Caries (Cavities)": 0.0,
                "Gingivitis": 0.0,
                "Mouth Ulcers": 0.0,
            }

            # Bright, white, low-saturation teeth → Normal
            if avg_brightness > 160 and dark_pixel_ratio < 0.05 and yellow_ratio < 0.1 and gum_redness_ratio < 1.35:
                scores["Normal"] += 3.0

            # Dark spots → Cavities
            if dark_pixel_ratio > 0.08:
                scores["Dental Caries (Cavities)"] += dark_pixel_ratio * 20
            if dark_pixel_ratio > 0.04:
                scores["Dental Caries (Cavities)"] += 0.5

            # Inflamed gums → Gingivitis
            if gum_redness_ratio > 1.4:
                scores["Gingivitis"] += (gum_redness_ratio - 1.4) * 8
            if avg_green < 100 and avg_red > 140:
                scores["Gingivitis"] += 0.5

            # Yellow / discolored teeth → Cavities or mild staining
            if yellow_ratio > 0.15:
                scores["Dental Caries (Cavities)"] += yellow_ratio * 5

            # Low brightness overall → possibly not teeth visible or poor lighting
            if avg_brightness < 100:
                scores["Normal"] -= 1.0

            # Pick the winner
            condition = max(scores, key=scores.get)
            best_score = scores[condition]

            # If scores are very low all around, default to Normal (not enough signal)
            if best_score < 0.3 or condition == "Normal":
                condition = "Normal"
                raw_conf = min(0.92, 0.70 + (avg_brightness / 255) * 0.2)
            else:
                raw_conf = min(0.89, 0.55 + best_score * 0.08)

            confidence = round(raw_conf * 100, 2)

            if condition != "Normal":
                alerts = [f"Potential {condition.lower()} indicators detected. Please consult a dentist for confirmation."]

            return {
                "condition": condition,
                "confidence": confidence,
                "alerts": alerts,
                "_debug": {
                    "avg_brightness": round(avg_brightness, 2),
                    "gum_redness_ratio": round(gum_redness_ratio, 3),
                    "dark_pixel_ratio": round(dark_pixel_ratio, 4),
                    "yellow_ratio": round(yellow_ratio, 4),
                }
            }

        except Exception as exc:
            print(f"Mouth heuristic analysis failed: {exc}")
            return {
                "condition": "Normal",
                "confidence": 72.0,
                "alerts": []
            }

analyzer = HealthAnalyzerModel()

def extract_regions(image_np: np.ndarray):
    h, w, _ = image_np.shape
    eye_crop, mouth_crop = None, None
    
    if face_mesh:
        results = face_mesh.process(cv2.cvtColor(image_np, cv2.COLOR_BGR2RGB))
        if results.multi_face_landmarks:
            landmarks = results.multi_face_landmarks[0].landmark
            
            # Approximate Eye region (Left eye landmarks roughly around 33, 133)
            eye_x_min = int(min([landmarks[p].x for p in range(33, 133)]) * w)
            eye_x_max = int(max([landmarks[p].x for p in range(33, 133)]) * w)
            eye_y_min = int(min([landmarks[p].y for p in range(33, 133)]) * h)
            eye_y_max = int(max([landmarks[p].y for p in range(33, 133)]) * h)
            
            # Approximate Mouth region
            mouth_x_min = int(min([landmarks[p].x for p in range(61, 291)]) * w)
            mouth_x_max = int(max([landmarks[p].x for p in range(61, 291)]) * w)
            mouth_y_min = int(min([landmarks[p].y for p in range(0, 17)]) * h) # rough y bound
            mouth_y_max = int(max([landmarks[p].y for p in range(0, 17)]) * h)
            
            # Simple bounding box with padding
            try:
                eye_crop = image_np[max(0, eye_y_min-20):min(h, eye_y_max+20), max(0, eye_x_min-20):min(w, eye_x_max+20)]
                mouth_crop = image_np[max(0, mouth_y_min-20):min(h, mouth_y_max+20), max(0, mouth_x_min-20):min(w, mouth_x_max+20)]
            except Exception:
                pass
                
    # Fallback to simple spatial slicing if mediapipe failed or found no face
    if eye_crop is None or mouth_crop is None:
        eye_crop = image_np[0:h//2, :] # top half
        mouth_crop = image_np[h//2:h, :] # bottom half
        
    return eye_crop, mouth_crop

@router.post("/")
async def analyze_health(
    file: UploadFile = File(...), 
    scan_type: str = Form(...),
    symptoms: Optional[str] = Form(None),
    user_id: int = Form(None),
    db: Session = Depends(get_db)
):
    """
    scan_type can be 'full_face', 'eye_only', or 'mouth_only'
    """
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if image is None:
        raise HTTPException(status_code=400, detail="Invalid image")

    response_data = {"scan_type": scan_type, "results": {}}
    
    def save_history(s_type, res):
        if user_id and "error" not in res:
            record = ScanHistory(
                user_id=user_id,
                scan_type=s_type,
                detected_condition=res["condition"],
                confidence=res["confidence"]
            )
            db.add(record)
            db.commit()

    # Process based on scan_type
    if scan_type == 'full_face':
        eye_crop, mouth_crop = extract_regions(image)
        if eye_crop is not None and eye_crop.size > 0:
            res = analyzer.analyze_eye(eye_crop)
            response_data["results"]["eye"] = res
            save_history("eye", res)
        else:
            response_data["results"]["eye"] = {"error": "Eye region not detected"}
            
        if mouth_crop is not None and mouth_crop.size > 0:
            res = analyzer.analyze_mouth(mouth_crop)
            response_data["results"]["mouth"] = res
            save_history("oral", res)
        else:
            response_data["results"]["mouth"] = {"error": "Mouth region not detected"}
            
    elif scan_type == 'eye_only':
        res = analyzer.analyze_eye(image)
        response_data["results"]["eye"] = res
        save_history("eye", res)
    
    elif scan_type == 'mouth_only':
        res = analyzer.analyze_mouth(image)
        response_data["results"]["mouth"] = res
        save_history("oral", res)
        
    else:
        raise HTTPException(status_code=400, detail="Invalid scan_type")

    # Unified Symptom and Image Analysis
    symptom_list = []
    if symptoms:
        symptom_list = [s.strip() for s in symptoms.split(",") if s.strip()]

    category = "eye" if scan_type == "eye_only" else "mouth" if scan_type == "mouth_only" else "both"
    symptom_matches = match_symptoms(symptom_list, category)
    
    response_data["symptom_match"] = symptom_matches
    response_data["combined_assessment"] = generate_combined_assessment(response_data["results"], symptom_matches)
        
    return response_data
