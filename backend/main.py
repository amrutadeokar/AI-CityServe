

import sys
import os
import joblib
from transformers import pipeline
# from app.utils.language import detect_language, to_english, to_user_language

# -----------------------------
# Add project root to sys.path
# -----------------------------
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(PROJECT_ROOT)
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

# -----------------------------
# Load AI Models
# -----------------------------
ML_MODELS_PATH = os.path.join(PROJECT_ROOT, "ai-cityserve-ML")
PRIORITY_VECTOR_PATH = os.path.join(ML_MODELS_PATH, "priority_vectorizer.pkl")
PRIORITY_MODEL_PATH = os.path.join(ML_MODELS_PATH, "priority_model.pkl")
DEPT_VECTOR_PATH = os.path.join(ML_MODELS_PATH, "department_vectorizer.pkl")
DEPT_MODEL_PATH = os.path.join(ML_MODELS_PATH, "department_model.pkl")

try:
    department_model = joblib.load(DEPT_MODEL_PATH)
    department_vectorizer = joblib.load(DEPT_VECTOR_PATH)
    priority_model = joblib.load(PRIORITY_MODEL_PATH)
    priority_vectorizer = joblib.load(PRIORITY_VECTOR_PATH)
except Exception as e:
    print("Error loading models:", e)
    department_model = None
    department_vectorizer = None
    priority_model = None
    priority_vectorizer = None

# -----------------------------
# ML Prediction Functions
# -----------------------------
def ml_predict_department(description: str) -> str:
    if department_model is None or department_vectorizer is None:
        return "Others"
    text_vec = department_vectorizer.transform([description])
    department = department_model.predict(text_vec)[0]
    mapping = {
        "Sanitation": "Sanitation",
        "Water": "Water Supply",
        "Roads": "Roads",
        "Electricity": "Electricity",
        "Health": "Health",
        "Education": "Education",
        "Others": "Others"
    }
    return mapping.get(department, department)


def predict_priority_safe(description: str, department: str) -> str:
    text = description.lower()

    import re

    high_keywords = ["flood", "burst", "fire", "emergency", "injury", "accident", "danger"]
    medium_keywords = [
        "broken", "not working", "damaged", "leak",
        "cut", "outage", "no electricity", "power cut",
        "water supply", "no water",
        "construction", "paused", "delay",
        "vendor", "license", "illegal", "unauthorized",
        "pothole", "repair"
    ]

    # ===========================
    # NEW RULE: duration-based HIGH priority
    # e.g. "since 2 days", "for 3 days", "5 days"
    # ===========================
    duration_match = re.search(r'(\d+)\s*(day|days|week|weeks|month|months)', text)
    if duration_match:
        number = int(duration_match.group(1))
        if number >= 2:
            return "High"

    # HIGH override
    if any(word in text for word in high_keywords):
        return "High"

    # MEDIUM override (IMPORTANT)
    if any(word in text for word in medium_keywords):
        return "Medium"

    # ML fallback only for unclear cases
    if priority_model is None or priority_vectorizer is None:
        return "Medium"

    text_vec = priority_vectorizer.transform([description])
    ml_pred = priority_model.predict(text_vec)[0]

    # FINAL SAFETY OVERRIDE
    if any(word in text for word in medium_keywords) and ml_pred == "Low":
        return "Medium"

    return ml_pred

from app.ml_models.department_classifier import predict_department as rule_predict

def final_predict_department(description: str) -> str:
    dept = rule_predict(description)
    if dept != "Others":
        return dept
    return ml_predict_department(description)

# -----------------------------
# FastAPI App
# -----------------------------
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.routes import auth, complaints, feedback

app = FastAPI(title="AI CityServe")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = os.path.join(PROJECT_ROOT, "images")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/images", StaticFiles(directory=UPLOAD_DIR), name="images")

app.include_router(auth.router, prefix="/auth")
app.include_router(complaints.router, prefix="/complaints")
app.include_router(feedback.router, prefix="/feedback")

@app.get("/")
def root():
    return {"message": "Welcome to AI CityServe API"}

# Load Hugging Face sentiment analysis pipeline
sentiment_model = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")

def get_sentiment(comment: str) -> str:
    """
    Returns sentiment label for a given comment.
    Uses Hugging Face DistilBERT sentiment analysis.
    """
    if not comment or comment.strip() == "":
        return "Neutral"
    
    result = sentiment_model(comment[:512])[0]  # truncate to 512 tokens for safety
    label = result["label"]  # 'POSITIVE' or 'NEGATIVE'
    # Map to your dashboard format
    return "Positive" if label == "POSITIVE" else "Negative"


# def multilingual_predict(description: str):
#     """
#     Full multilingual pipeline:
#     1. Detect language
#     2. Translate to English
#     3. Run ML models
#     4. Return results + original language
#     """

#     # 1. Detect language
#     lang = detect_language(description)

#     # 2. Normalize Hinglish issues (optional safety layer)
#     description_en = to_english(description)

#     # 3. Run your existing models
#     department = final_predict_department(description_en)
#     priority = predict_priority_safe(description_en, department)
#     sentiment = get_sentiment(description_en)

#     # 4. Return everything + language
#     return {
#         "language": lang,
#         "department": department,
#         "priority": priority,
#         "sentiment": sentiment
#     }