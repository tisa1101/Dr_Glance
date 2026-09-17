from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db, ScanHistory
import requests

router = APIRouter()

daily_tips = {
    "eye": [
        "Take a break every 20 minutes to look at something 20 feet away for 20 seconds.",
        "Ensure proper lighting when reading or using digital screens.",
        "Wear UV-protective sunglasses when outdoors."
    ],
    "oral": [
        "Brush your teeth at least twice a day with fluoride toothpaste.",
        "Floss daily to remove plaque from between your teeth.",
        "Limit sugary snacks and drinks to protect your tooth enamel."
    ]
}

diet_recommendations = {
    "eye": [
        {"food": "Carrots", "benefit": "Rich in Vitamin A, good for vision."},
        {"food": "Spinach & Kale", "benefit": "High in lutein and zeaxanthin, protects against macular degeneration."},
        {"food": "Almonds", "benefit": "Contains Vitamin E, which helps prevent cataracts."}
    ],
    "oral": [
        {"food": "Cheese", "benefit": "High in calcium and phosphate, helps remineralize teeth."},
        {"food": "Apples", "benefit": "Stimulates saliva production to wash away bacteria."},
        {"food": "Yogurt", "benefit": "Probiotics help maintain healthy gums."}
    ]
}

@router.get("/tips")
def get_tips():
    return {"tips": daily_tips}

@router.get("/diet/{user_id}")
def get_personalized_diet(user_id: int, db: Session = Depends(get_db)):
    # Fetch user's latest health problems from history
    user_history = db.query(ScanHistory).filter(ScanHistory.user_id == user_id).order_by(ScanHistory.timestamp.desc()).limit(10).all()
    
    problems = set([record.detected_condition.lower() for record in user_history if record.detected_condition.lower() != "normal"])
    
    # Base personalized diet structure
    personalized_diet = {"eye": [], "oral": []}
    
    # 1. Dietary Logic for Eye Issues
    if "conjunctivitis" in problems or "redness" in problems:
        personalized_diet["eye"].append({"food": "Citrus Fruits & Peppers", "benefit": "High in Vitamin C to fight eye infections and reduce inflammation."})
        personalized_diet["eye"].append({"food": "Flaxseeds", "benefit": "Omega-3s naturally lubricate eyes to prevent redness."})
    if "eye fatigue / dryness" in problems or "fatigue" in problems:
        personalized_diet["eye"].append({"food": "Salmon & Tuna", "benefit": "Rich in Omega-3 fatty acids, excellent for combating dry eyes."})
        personalized_diet["eye"].append({"food": "Sweet Potatoes", "benefit": "Vast amounts of beta-carotene to prevent night blindness and strain."})
        
    if not personalized_diet["eye"]: # Default if no eye problems
        personalized_diet["eye"] = diet_recommendations["eye"][:2]

    # 2. Dietary Logic for Oral Issues
    if "cavities" in problems:
        personalized_diet["oral"].append({"food": "Cheese & Milk", "benefit": "Calcium directly remineralizes tooth enamel damaged by cavities."})
        personalized_diet["oral"].append({"food": "Sugar-free Gum", "benefit": "Stimulates saliva flow to wash away cavity-causing acids."})
    if "gum disease" in problems or "mouth ulcers" in problems:
        personalized_diet["oral"].append({"food": "Leafy Greens", "benefit": "High in Vitamin K and Folate, critical for healing bleeding gums."})
        personalized_diet["oral"].append({"food": "Yogurt", "benefit": "Probiotics balance mouth bacteria and reduce mouth ulcer flare-ups."})
        
    if not personalized_diet["oral"]: # Default if no oral problems
        personalized_diet["oral"] = diet_recommendations["oral"][:2]

    return {"diet": personalized_diet}

