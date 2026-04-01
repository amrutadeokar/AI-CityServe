import os
import joblib
import numpy as np

ML_MODELS_PATH = os.path.dirname(__file__)
VECTOR_PATH = os.path.join(ML_MODELS_PATH, "priority_vectorizer.pkl")
MODEL_PATH = os.path.join(ML_MODELS_PATH, "priority_model.pkl")

try:
    vectorizer = joblib.load(VECTOR_PATH)
    model = joblib.load(MODEL_PATH)
except Exception as e:
    print("Error loading AI model:", e)
    vectorizer = None
    model = None

def predict_priority(complaint_text, department):
    text = str(complaint_text).lower()
    department = str(department).lower()

    high_keywords = ["flood", "burst", "fire", "emergency", "injury", "accident", "danger"]
    medium_keywords = ["urgent", "blocked", "broken", "not working", "damaged", "leak"]

    if any(word in text for word in high_keywords):
        return "High"

    if department == "health" and any(word in text for word in ["food poisoning", "contamination", "infection"]):
        return "High"

    if any(word in text for word in medium_keywords):
        return "Medium"

    if vectorizer is not None and model is not None:
        X = vectorizer.transform([complaint_text])
        prediction = model.predict(X)[0]

        if isinstance(prediction, (np.integer, int)):
            label_map = {0: "Low", 1: "Medium", 2: "High"}
            return label_map.get(int(prediction), "Low")
        elif isinstance(prediction, str):
            pred = prediction.strip().lower()
            if "high" in pred:
                return "High"
            elif "medium" in pred:
                return "Medium"
            elif "low" in pred:
                return "Low"
        elif hasattr(prediction, "item"):  # numpy scalar
            val = prediction.item()
            label_map = {0: "Low", 1: "Medium", 2: "High"}
            return label_map.get(val, "Low")

    return "Low"


