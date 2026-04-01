
from transformers import pipeline
from app.database import feedback_collection  # MongoDB collection
from bson import ObjectId

sentiment_model = pipeline(
    "sentiment-analysis",
    model="distilbert-base-uncased-finetuned-sst-2-english"
)

def get_sentiment(text: str):
    if not text or text.strip() == "":
        return "Neutral"
    
    result = sentiment_model(text[:512])[0]  # analyze first 512 characters
    label = result["label"]
    score = result["score"]
    
    # If model is not confident, classify as Neutral
    if score < 0.6:
        return "Neutral"
    
    return "Positive" if label == "POSITIVE" else "Negative"


def update_all_feedback_sentiment():
    all_feedbacks = feedback_collection.find()
    count = 0

    for fb in all_feedbacks:
        comment = fb.get("comments", "").strip()
        rating = fb.get("overall_experience") or fb.get("rating", 3)

        # Case 1: If comment exists → use AI model
        if comment:
            sentiment = get_sentiment(comment)

        # Case 2: If comment is empty → use rating
        else:
            if rating >= 4:
                sentiment = "Positive"
            elif rating <= 2:
                sentiment = "Negative"
            else:
                sentiment = "Neutral"

        feedback_collection.update_one(
            {"_id": ObjectId(fb["_id"])},
            {"$set": {"sentiment": sentiment}}
        )

        count += 1

    print(f"Updated sentiment for {count} feedbacks.")


if __name__ == "__main__":
    update_all_feedback_sentiment()
