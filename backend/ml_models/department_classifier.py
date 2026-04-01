def predict_department(description: str) -> str:
    text = description.lower()

    # ✅ Handle street lights first
    if "street light" in text or "lamp post" in text or "streetlight" in text:
        return "Electricity"

    # ✅ Handle potholes first
    if "pothole" in text or "potholes" in text:
        return "Roads"

    # Water-related
    if any(word in text for word in ["water", "leak", "pipe", "supply"]):
        return "Water Supply"

    # Sanitation-related
    if any(word in text for word in ["garbage", "trash", "waste", "sanitation", "cleaning"]):
        return "Sanitation"

    # Roads-related (general, but exclude street lights)
    if any(word in text for word in ["road", "traffic", "highway"]):
        return "Roads"

    # Health-related
    if any(word in text for word in ["hospital", "doctor", "health", "clinic"]):
        return "Health"

    # Electricity-related (general)
    if any(word in text for word in ["electricity", "power", "wire", "transformer"]):
        return "Electricity"

    # Education-related
    if any(word in text for word in ["school", "education", "teacher", "student", "classroom"]):
        return "Education"

    # Property tax
    if any(word in text for word in ["tax", "property", "house tax"]):
        return "Property Tax"

    # Public transport
    if any(word in text for word in ["bus", "train", "transport", "metro"]):
        return "Public Transport"

    # Fire-related
    if any(word in text for word in ["fire", "burn", "smoke", "blast"]):
        return "Others"   # or "Fire Department"

    return "Others"
