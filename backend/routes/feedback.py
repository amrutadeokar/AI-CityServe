from fastapi import APIRouter
from datetime import datetime
from app.database import feedback_collection, complaints_collection
from app.models import Feedback
from bson import ObjectId

router = APIRouter()


# ---------------- SIMPLE SENTIMENT ANALYZER ---------------- #
def analyze_sentiment(text: str):

    if not text or text.strip() == "":
        return "Neutral"

    text = text.lower()

    positive_words = [
        "good","great","excellent","fast","quick",
        "helpful","nice","smooth","satisfied","amazing"
    ]

    negative_words = [
        "bad","slow","poor","terrible",
        "delay","problem","issue","worst"
    ]

    pos_score = sum(word in text for word in positive_words)
    neg_score = sum(word in text for word in negative_words)

    # ✅ NEW: detect mixed sentiment
    if "but" in text:
        return "Neutral"

    if pos_score == 0 and neg_score == 0:
        return "Neutral"
    elif pos_score > neg_score:
        return "Positive"
    elif neg_score > pos_score:
        return "Negative"
    else:
        return "Neutral"


# ---------------- SUBMIT FEEDBACK ---------------- #
@router.post("/submit-feedback")
def submit_feedback(feedback: Feedback):

    feedback_dict = feedback.dict()

    # rating for analytics
    feedback_dict["rating"] = feedback_dict.get("overall_experience", 0)

    # sentiment detection
    sentiment = analyze_sentiment(feedback.comments)
    feedback_dict["sentiment"] = sentiment
    feedback_dict["created_at"] = datetime.utcnow()

    result = feedback_collection.insert_one(feedback_dict)

    # ✅ Only update if complaint_id exists
    if feedback.complaint_id:
        complaints_collection.update_one(
            {"_id": ObjectId(feedback.complaint_id)},
            {"$set": {"feedback_given": True}}
        )

    return {
        "message": "Feedback submitted successfully",
        "sentiment": sentiment,
        "id": str(result.inserted_id)
    }

# ---------------- GET ALL FEEDBACK ---------------- #
@router.get("/all-feedback")
def get_feedback():
    feedbacks = []
    for fb in feedback_collection.find().sort("created_at", -1):  # newest first
        fb["_id"] = str(fb["_id"])
        feedbacks.append(fb)
    return feedbacks

def get_ai_suggested_action(text: str, priority: str):
    if not text:
        return "No action required"

    text = text.lower()

    # 🔥 keyword-based NLP logic
    if "water" in text or "leak" in text:
        return "Assign to Water Department immediately"

    elif "road" in text or "pothole" in text:
        return "Schedule road inspection and repair"

    elif "electricity" in text or "power" in text:
        return "Send technician for electrical check"

    elif "garbage" in text or "waste" in text:
        return "Dispatch sanitation team"

    # fallback using priority
    if priority == "High":
        return "Immediate attention required"
    elif priority == "Medium":
        return "Resolve within 24-48 hours"
    else:
        return "Can be handled routinely"