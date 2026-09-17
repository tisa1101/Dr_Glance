from fastapi import APIRouter
from pydantic import BaseModel
import os
import json
import random
import pickle

router = APIRouter()

# Try loading Keras/NLTK for the advanced AI NLP Chatbot.
keras_model = None
words = []
classes = []
intents_json = {}
lemmatizer = None

try:
    import nltk
    from nltk.stem import WordNetLemmatizer
    import numpy as np
    from tensorflow.keras.models import load_model
    
    model_path = '../models/chatbot_model.h5'
    words_path = '../models/chatbot_words.pkl'
    classes_path = '../models/chatbot_classes.pkl'
    intents_path = '../training/doctor_intents.json'
    
    if os.path.exists(model_path) and os.path.exists(words_path):
        lemmatizer = WordNetLemmatizer()
        keras_model = load_model(model_path)
        words = pickle.load(open(words_path, 'rb'))
        classes = pickle.load(open(classes_path, 'rb'))
        intents_json = json.loads(open(intents_path).read())
        print("Successfully Loaded Native Keras AI Chatbot!")
except Exception as e:
    print(f"Standard NLP rules engine loaded. (Install tensorflow & train the keras model to unlock Deep Learning NLP: {e})")

def predict_keras_class(sentence):
    # tokenize and lemmatize
    sentence_words = nltk.word_tokenize(sentence)
    sentence_words = [lemmatizer.lemmatize(word.lower()) for word in sentence_words]
    # bag of words
    bag = [0]*len(words)  
    for s in sentence_words:
        for i, w in enumerate(words):
            if w == s: 
                bag[i] = 1
                
    res = keras_model.predict(np.array([bag]))[0]
    ERROR_THRESHOLD = 0.25
    results = [[i, r] for i, r in enumerate(res) if r > ERROR_THRESHOLD]
    results.sort(key=lambda x: x[1], reverse=True)
    
    return_list = []
    for r in results:
        return_list.append({"intent": classes[r[0]], "probability": str(r[1])})
    return return_list

class ChatRequest(BaseModel):
    message: str
    context: dict = None

@router.post("/")
def chat_with_bot(request: ChatRequest):
    user_message = request.message.lower()
    
    # 1. Keras Deep Learning Inference (If trained and active)
    if keras_model is not None:
        try:
            ints = predict_keras_class(user_message)
            if ints:
                tag = ints[0]['intent']
                for i in intents_json['intents']:
                    if i['tag'] == tag:
                        return {"reply": random.choice(i['responses'])}
        except Exception as e:
            pass # Fall back to rules engine if interference fails
            
    # 2. Advanced NLP Rules Engine Fallback
    if any(word in user_message for word in ["hello", "hi", "hey"]):
        return {"reply": "Hello! I am Dr. Glance AI, your personal eye and oral health assistant. How can I help you today?"}
        
    if "eye" in user_message or "red" in user_message or "vision" in user_message or "blur" in user_message:
        if "red" in user_message:
            return {"reply": "Redness can be a sign of conjunctivitis, allergies, or fatigue. If you have discharge, it could be an infection. Try uploading an Eye Region scan for our AI to check!"}
        return {"reply": "For eye strain, remember the 20-20-20 rule: every 20 mins, look 20 feet away for 20 secs. Have you used our AI diagnostics feature to scan your eyes today?"}
        
    elif "tooth" in user_message or "teeth" in user_message or "gum" in user_message or "mouth" in user_message or "pain" in user_message:
        if "pain" in user_message or "bleed" in user_message:
            return {"reply": "Bleeding or pain in the gums could indicate gingivitis or early gum disease. Please ensure you are flossing and brushing twice a day. Upload a Mouth scan so I can visually inspect it."}
        return {"reply": "Oral hygiene is critical! Cavities can form if plaques aren't removed. Try eating less sugar and uploading a mouth scan for a quick plaque check."}
        
    elif "history" in user_message or "record" in user_message or "past" in user_message:
        return {"reply": "You can view your past checkups and historical confidence graphs in the newly added Dashboard History tab!"}

    elif "diet" in user_message or "food" in user_message:
        return {"reply": "Eating carrots and spinach helps your eyes (Vitamin A & Lutein), while cheese and yogurt are great for your teeth (Calcium). Check the Diet tab!"}
        
    else:
        return {"reply": "I am specifically trained to help with Ophthalmology (Eye) and Dental (Oral) queries. You can ask me about symptoms, diet, or how to use the AI scanner!"}
