import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score
from imblearn.over_sampling import RandomOverSampler
from department_classifier import predict_department


# ===========================
# 1️⃣ LOAD DATASET
# ===========================
df = pd.read_csv("dataset/311_cleaned_mapped.csv")
print("Dataset Loaded Successfully!")
print(df.head())

# ✅ Fix Street Light complaints mapping
df.loc[
    df["Problem (formerly Complaint Type)"].str.contains("Street Light", case=False, na=False),
    "Department_Category"
] = "Electricity"

# ✅ Fix Pothole complaints mapping
df.loc[
    df["Problem (formerly Complaint Type)"].str.contains("Pothole", case=False, na=False),
    "Department_Category"
] = "Roads"

import pandas as pd

# Load your existing dataset
df = pd.read_csv("dataset/311_cleaned_mapped.csv")

# Synthetic complaints for balancing
synthetic = pd.DataFrame([
    # === Education (20 samples) ===
    {"Problem (formerly Complaint Type)": "School classroom ceiling leaking during rain", "Agency Name": "Department of Education", "Department_Category": "Education"},
    {"Problem (formerly Complaint Type)": "Playground equipment damaged in municipal school", "Agency Name": "Department of Education", "Department_Category": "Education"},
    {"Problem (formerly Complaint Type)": "No electricity in school computer lab", "Agency Name": "Department of Education", "Department_Category": "Education"},
    {"Problem (formerly Complaint Type)": "School toilets not cleaned properly", "Agency Name": "Department of Education", "Department_Category": "Education"},
    {"Problem (formerly Complaint Type)": "Broken desks in classroom", "Agency Name": "Department of Education", "Department_Category": "Education"},
    {"Problem (formerly Complaint Type)": "Unsafe playground swings in school", "Agency Name": "Department of Education", "Department_Category": "Education"},
    {"Problem (formerly Complaint Type)": "School library lights not working", "Agency Name": "Department of Education", "Department_Category": "Education"},
    {"Problem (formerly Complaint Type)": "Water leakage in school corridor", "Agency Name": "Department of Education", "Department_Category": "Education"},
    {"Problem (formerly Complaint Type)": "School boundary wall damaged", "Agency Name": "Department of Education", "Department_Category": "Education"},
    {"Problem (formerly Complaint Type)": "School sanitation issue reported by parents", "Agency Name": "Department of Education", "Department_Category": "Education"},
    {"Problem (formerly Complaint Type)": "School bus broken down frequently", "Agency Name": "Department of Education", "Department_Category": "Education"},
    {"Problem (formerly Complaint Type)": "School classroom fans not working", "Agency Name": "Department of Education", "Department_Category": "Education"},
    {"Problem (formerly Complaint Type)": "School playground flooding during monsoon", "Agency Name": "Department of Education", "Department_Category": "Education"},
    {"Problem (formerly Complaint Type)": "School drinking water not clean", "Agency Name": "Department of Education", "Department_Category": "Education"},
    {"Problem (formerly Complaint Type)": "School laboratory equipment damaged", "Agency Name": "Department of Education", "Department_Category": "Education"},
    {"Problem (formerly Complaint Type)": "School classroom windows broken", "Agency Name": "Department of Education", "Department_Category": "Education"},
    {"Problem (formerly Complaint Type)": "School roof tiles falling", "Agency Name": "Department of Education", "Department_Category": "Education"},
    {"Problem (formerly Complaint Type)": "School playground lights not working", "Agency Name": "Department of Education", "Department_Category": "Education"},
    {"Problem (formerly Complaint Type)": "School sanitation workers absent", "Agency Name": "Department of Education", "Department_Category": "Education"},
    {"Problem (formerly Complaint Type)": "School classroom paint peeling", "Agency Name": "Department of Education", "Department_Category": "Education"},

    # === Electricity (20 samples) ===
    {"Problem (formerly Complaint Type)": "Transformer burst causing power outage", "Agency Name": "Department of Buildings", "Department_Category": "Electricity"},
    {"Problem (formerly Complaint Type)": "Street lights not working for past 3 days", "Agency Name": "Department of Transportation", "Department_Category": "Electricity"},
    {"Problem (formerly Complaint Type)": "Frequent electricity cuts in residential area", "Agency Name": "Department of Buildings", "Department_Category": "Electricity"},
    {"Problem (formerly Complaint Type)": "Electric pole wires hanging dangerously", "Agency Name": "Department of Buildings", "Department_Category": "Electricity"},
    {"Problem (formerly Complaint Type)": "Power surge damaged household appliances", "Agency Name": "Department of Buildings", "Department_Category": "Electricity"},
    {"Problem (formerly Complaint Type)": "Street light flickering continuously", "Agency Name": "Department of Transportation", "Department_Category": "Electricity"},
    {"Problem (formerly Complaint Type)": "Transformer overheating reported", "Agency Name": "Department of Buildings", "Department_Category": "Electricity"},
    {"Problem (formerly Complaint Type)": "Electricity outage during festival", "Agency Name": "Department of Buildings", "Department_Category": "Electricity"},
    {"Problem (formerly Complaint Type)": "Street lights broken in park", "Agency Name": "Department of Transportation", "Department_Category": "Electricity"},
    {"Problem (formerly Complaint Type)": "Electric meter malfunctioning", "Agency Name": "Department of Buildings", "Department_Category": "Electricity"},
    {"Problem (formerly Complaint Type)": "Street lights missing in colony", "Agency Name": "Department of Transportation", "Department_Category": "Electricity"},
    {"Problem (formerly Complaint Type)": "Transformer oil leakage", "Agency Name": "Department of Buildings", "Department_Category": "Electricity"},
    {"Problem (formerly Complaint Type)": "Street lights not repaired after complaint", "Agency Name": "Department of Transportation", "Department_Category": "Electricity"},
    {"Problem (formerly Complaint Type)": "Electric pole leaning dangerously", "Agency Name": "Department of Buildings", "Department_Category": "Electricity"},
    {"Problem (formerly Complaint Type)": "Street lights switched off at night", "Agency Name": "Department of Transportation", "Department_Category": "Electricity"},
    {"Problem (formerly Complaint Type)": "Transformer sparks observed", "Agency Name": "Department of Buildings", "Department_Category": "Electricity"},
    {"Problem (formerly Complaint Type)": "Street lights wiring exposed", "Agency Name": "Department of Transportation", "Department_Category": "Electricity"},
    {"Problem (formerly Complaint Type)": "Electricity outage in hospital", "Agency Name": "Department of Buildings", "Department_Category": "Electricity"},
    {"Problem (formerly Complaint Type)": "Street lights broken after storm", "Agency Name": "Department of Transportation", "Department_Category": "Electricity"},
    {"Problem (formerly Complaint Type)": "Transformer noise disturbing residents", "Agency Name": "Department of Buildings", "Department_Category": "Electricity"},

    # === Health (20 samples) ===
    {"Problem (formerly Complaint Type)": "Hospital emergency ward overcrowded", "Agency Name": "Department of Health and Mental Hygiene", "Department_Category": "Health"},
    {"Problem (formerly Complaint Type)": "Food poisoning reported at local restaurant", "Agency Name": "Department of Health and Mental Hygiene", "Department_Category": "Health"},
    {"Problem (formerly Complaint Type)": "Rodent infestation in public park", "Agency Name": "Department of Health and Mental Hygiene", "Department_Category": "Health"},
    {"Problem (formerly Complaint Type)": "Noise pollution near hospital disturbing patients", "Agency Name": "Department of Health and Mental Hygiene", "Department_Category": "Health"},
    {"Problem (formerly Complaint Type)": "Contaminated water supply in colony", "Agency Name": "Department of Health and Mental Hygiene", "Department_Category": "Health"},
    {"Problem (formerly Complaint Type)": "Mosquito breeding in stagnant water", "Agency Name": "Department of Health and Mental Hygiene", "Department_Category": "Health"},
    {"Problem (formerly Complaint Type)": "Garbage near hospital causing infection risk", "Agency Name": "Department of Health and Mental Hygiene", "Department_Category": "Health"},
    {"Problem (formerly Complaint Type)": "Restaurant hygiene violation reported", "Agency Name": "Department of Health and Mental Hygiene", "Department_Category": "Health"},
    {"Problem (formerly Complaint Type)": "Hospital sanitation workers absent", "Agency Name": "Department of Health and Mental Hygiene", "Department_Category": "Health"},
    {"Problem (formerly Complaint Type)": "Noise from construction near hospital", "Agency Name": "Department of Health and Mental Hygiene", "Department_Category": "Health"},
    {"Problem (formerly Complaint Type)": "Rodents in school kitchen", "Agency Name": "Department of Health and Mental Hygiene", "Department_Category": "Health"},
    {"Problem (formerly Complaint Type)": "Food contamination in canteen", "Agency Name": "Department of Health and Mental Hygiene", "Department_Category": "Health"},
    {"Problem (formerly Complaint Type)": "Hospital waste not disposed properly", "Agency Name": "Department of Health and Mental Hygiene", "Department_Category": "Health"},
    {"Problem (formerly Complaint Type)": "Noise pollution from vehicles near hospital", "Agency Name": "Department of Health and Mental Hygiene", "Department_Category": "Health"},
    {"Problem (formerly Complaint Type)": "Rodent infestation in residential colony", "Agency Name": "Department of Health and Mental Hygiene", "Department_Category": "Health"},
    {"Problem (formerly Complaint Type)": "Food poisoning outbreak in community", "Agency Name": "Department of Health and Mental Hygiene", "Department_Category": "Health"},
    {"Problem (formerly Complaint Type)": "Hospital emergency equipment not working", "Agency Name": "Department of Health and Mental Hygiene", "Department_Category": "Health"},
    {"Problem (formerly Complaint Type)": "Noise pollution from factory near hospital", "Agency Name": "Department of Health and Mental Hygiene", "Department_Category": "Health"},
    {"Problem (formerly Complaint Type)": "Rodents"}
]) # Merge synthetic complaints into dataset df = pd.concat([df, synthetic], ignore_index=True)
# ===========================
# 2️⃣ PRIORITY LABEL CREATION
# ===========================
def assign_priority(text, department):
    text = str(text).lower()

    score = 0

    # HIGH severity signals
    high_words = ["fire", "burst", "explosion", "accident", "injury", "gas leak", "danger"]
    score += 3 * sum(word in text for word in high_words)

    # MEDIUM severity signals (broader + semantic)
    medium_words = [
        "broken", "not working", "damaged",
        "cut", "outage", "power", "electricity",
        "water", "supply",
        "road", "pothole", "construction", "delay",
        "vendor", "license", "illegal", "unauthorized"
    ]
    score += 2 * sum(word in text for word in medium_words)

    # TIME indicators (VERY IMPORTANT for civic complaints)
    time_words = ["since", "days", "weeks", "months"]
    score += 2 * sum(word in text for word in time_words)

    # ===========================
    # NEW RULE: Duration-based HIGH priority
    # Example: "since 2 days", "for 3 days", "5 days"
    # ===========================
    import re

    duration_match = re.search(r'(\d+)\s*(day|days|week|weeks|month|months)', text)

    if duration_match:
        number = int(duration_match.group(1))

        # if more than 1 day/week/month → HIGH
        if number >= 2:
            return "High"

    # FINAL DECISION
    if score >= 5:
        return "High"
    elif score >= 2:
        return "Medium"
    else:
        return "Low"
    
df["Priority"] = df.apply(
    lambda row: assign_priority(
        row["Problem (formerly Complaint Type)"],
        row["Department_Category"]
    ),
    axis=1
)

print("\nPriority Distribution:")
print(df["Priority"].value_counts())

# ===========================
# 3️⃣ TRAIN PRIORITY MODEL WITH OVERSAMPLING
# ===========================
vectorizer_p = TfidfVectorizer(stop_words='english')
X_p = vectorizer_p.fit_transform(df["Problem (formerly Complaint Type)"])
y_p = df["Priority"]

# Oversample minority classes
ros = RandomOverSampler(random_state=42)
X_resampled_p, y_resampled_p = ros.fit_resample(X_p, y_p)

X_train_p, X_test_p, y_train_p, y_test_p = train_test_split(
    X_resampled_p, y_resampled_p, test_size=0.2, random_state=42
)

priority_model = LogisticRegression(max_iter=1000)
priority_model.fit(X_train_p, y_train_p)

# Evaluate model
y_pred_p = priority_model.predict(X_test_p)
print("\n=== Priority Model Evaluation ===")
print("Accuracy:", accuracy_score(y_test_p, y_pred_p))
print(classification_report(y_test_p, y_pred_p, zero_division=0))

# Save model + vectorizer
joblib.dump(priority_model, "priority_model.pkl")
joblib.dump(vectorizer_p, "priority_vectorizer.pkl")
print("\nPriority Model Saved Successfully!")

# ===========================
# 4️⃣ PREDICTION FUNCTION (RULE + ML)
# ===========================
def predict_priority(complaint_text, department):
    text = str(complaint_text).lower()
    department = str(department).lower()

    # Rule-based High priority override
    high_keywords = ["flood", "burst", "fire", "emergency", "injury", "accident", "danger"]
    if any(word in text for word in high_keywords):
        print("⚠️ ALERT: High-priority complaint detected! Immediate attention required!")
        return "High"

    if department == "health" and any(word in text for word in ["food poisoning", "contamination", "infection"]):
        print("⚠️ ALERT: High-priority complaint detected! Immediate attention required!")
        return "High"

    # Otherwise, ML prediction
    text_vec = vectorizer_p.transform([complaint_text])
    predicted_priority = priority_model.predict(text_vec)[0]

    if predicted_priority == "High":
        print("⚠️ ALERT: High-priority complaint detected! Immediate attention required!")

    return predicted_priority

# ===========================
# 5️⃣ TEST PREDICTION
# ===========================
if __name__ == "__main__":
    test_complaint = "Street light not working"
    test_department = "Roads"
    priority = predict_priority(test_complaint, test_department)
    print("Predicted Priority:", priority)

# ===========================
# 6️⃣ TRAIN DEPARTMENT MODEL WITH OVERSAMPLING
# ===========================
vectorizer_d = TfidfVectorizer(stop_words='english')
X_d = vectorizer_d.fit_transform(df["Problem (formerly Complaint Type)"])
y_d = df["Department_Category"]

# Oversample minority classes
X_resampled_d, y_resampled_d = ros.fit_resample(X_d, y_d)

X_train_d, X_test_d, y_train_d, y_test_d = train_test_split(
    X_resampled_d, y_resampled_d, test_size=0.2, random_state=42
)

department_model = LogisticRegression(max_iter=1000)
department_model.fit(X_train_d, y_train_d)

# Evaluate
y_pred_d = department_model.predict(X_test_d)
print("\n=== Department Model Evaluation ===")
print("Accuracy:", accuracy_score(y_test_d, y_pred_d))
print(classification_report(y_test_d, y_pred_d, zero_division=0))

# Save model + vectorizer
joblib.dump(department_model, "department_model.pkl")
joblib.dump(vectorizer_d, "department_vectorizer.pkl")
print("\nDepartment Model Saved Successfully!")


# ===========================
# 7️⃣ DEPARTMENT PREDICTION FUNCTION (RULE + ML)
# ===========================
def predict_department(description: str) -> str:
    """Predict department using ML model, with keyword overrides."""
    if department_model is None or vectorizer_d is None:
        return "Others"

    desc = description.lower()

    # ✅ Keyword overrides
    if "street light" in desc or "lamp post" in desc:
        return "Electricity"
    if "school" in desc or "classroom" in desc or "education" in desc:
        return "Education"
    if "hospital" in desc or "clinic" in desc:
        return "Health"

    # ML fallback
    text_vec = vectorizer_d.transform([description])
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