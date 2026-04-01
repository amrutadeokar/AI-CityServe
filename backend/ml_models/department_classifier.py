def predict_department(description: str) -> str:
    text = description.lower()

    if "street light" in text or "lamp post" in text or "streetlight" in text:
        return "Electricity"

    if "pothole" in text or "potholes" in text:
        return "Roads"

    if any(word in text for word in ["water", "leak", "pipe", "supply"]):
        return "Water Supply"

    if any(word in text for word in ["garbage", "trash", "waste", "sanitation", "cleaning"]):
        return "Sanitation"

    if any(word in text for word in ["road", "traffic", "highway"]):
        return "Roads"

    if any(word in text for word in ["hospital", "doctor", "health", "clinic"]):
        return "Health"

    if any(word in text for word in ["electricity", "power", "wire", "transformer"]):
        return "Electricity"

    if any(word in text for word in ["school", "education", "teacher", "student", "classroom"]):
        return "Education"

    if any(word in text for word in ["tax", "property", "house tax"]):
        return "Property Tax"

    if any(word in text for word in ["bus", "train", "transport", "metro"]):
        return "Public Transport"

    if any(word in text for word in ["fire", "burn", "smoke", "blast"]):
        return "Others"   # or "Fire Department"

    return "Others"
