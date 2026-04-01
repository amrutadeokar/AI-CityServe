import os
import pandas as pd

# Get AI-CITYSERVE project root
PROJECT_ROOT = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..")
)

# Correct dataset path (since dataset is inside ai-cityserve-ML folder)
DATASET_PATH = os.path.join(
    PROJECT_ROOT,
    "ai-cityserve-ML",
    "dataset",
    "311_cleaned_training_data.csv"
)

print("PROJECT_ROOT:", PROJECT_ROOT)
print("Loading dataset from:", DATASET_PATH)

# Load dataset
df = pd.read_csv(DATASET_PATH)
print("✅ Dataset loaded successfully!")

# Step 1: Define mapping dictionary
DEPARTMENT_MAP = {
    "Department of Sanitation": "Sanitation",
    "Department of Environmental Protection": "Water Supply",
    "Department of Housing Preservation and Development": "Water Supply",
    "Department of Transportation": "Roads",
    "New York City Police Department": "Roads",
    "Department of Health and Mental Hygiene": "Health",
    "Economic Development Corporation": "Health",
    "Department of Buildings": "Water Supply",
    "Department of Education": "Education",
}

# Step 2: Apply mapping
df["Department_Category"] = (
    df["Agency Name"]
    .map(DEPARTMENT_MAP)
    .fillna("Others")
)

# Step 3: Keyword override logic
def override_department(description, current_dept):
    text = str(description).lower()

    if any(word in text for word in ["garbage", "trash", "waste", "dumping", "dirty", "collection"]):
        return "Sanitation"

    if any(word in text for word in ["water", "leak", "sewer", "drainage", "pipeline", "heat"]):
        return "Water Supply"

    if any(word in text for word in ["road", "pothole", "sidewalk", "traffic", "signal"]):
        return "Roads"

    if any(word in text for word in ["street light", "electric", "power", "light", "outage"]):
        return "Electricity"

    if any(word in text for word in ["hospital", "health", "rodent", "infection", "noise"]):
        return "Health"

    if "school" in text or "education" in text:
        return "Education"

    return current_dept


df["Department_Category"] = df.apply(
    lambda row: override_department(
        row.get("Problem (formerly Complaint Type)", ""),
        row["Department_Category"]
    ),
    axis=1
)

# Save mapped dataset back into ai-cityserve-ML/dataset
OUTPUT_PATH = os.path.join(
    PROJECT_ROOT,
    "ai-cityserve-ML",
    "dataset",
    "311_cleaned_mapped.csv"
)

df.to_csv(OUTPUT_PATH, index=False)

print(f"✅ Dataset cleaned and saved as: {OUTPUT_PATH}")