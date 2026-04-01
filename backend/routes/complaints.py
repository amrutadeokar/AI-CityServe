

from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, WebSocket
from app.routes.auth import get_current_user
from app.database import complaints_collection
from bson import ObjectId
import os
import uuid
from jose import jwt, JWTError
from datetime import datetime  
from typing import Optional

from app.main import predict_priority_safe, final_predict_department

router = APIRouter()

UPLOAD_FOLDER = "images"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

SECRET_KEY = "your_super_secret_key_here"
ALGORITHM = "HS256"

# CREATE COMPLAINT  
@router.post("/create")
async def create_complaint(
    description: str = Form(...),
    location: str = Form(...),
    # image: UploadFile = File(...),
    image: Optional[UploadFile] = File(None),
    current_user: dict = Depends(get_current_user)
):
    department = final_predict_department(description)
    predicted_priority = predict_priority_safe(description, department)


    department = final_predict_department(description)
    predicted_priority = predict_priority_safe(description, department)

    ext = image.filename.split(".")[-1]
    filename = f"{uuid.uuid4().hex}.{ext}"
    path = os.path.join(UPLOAD_FOLDER, filename)

    with open(path, "wb") as f:
        f.write(await image.read())

    complaints_collection.insert_one({
        "department": department,
        "description": description,
        "location": location,
        "image": filename,
        "status": "Pending",
        "priority": predicted_priority,
        "user_email": current_user["email"],
        "feedback_given": False,

        "status_history": [
            {
                "status": "Created",
                "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "note": "Complaint submitted"
            }
        ]
    })

    return {
        "message": "Complaint created successfully",
        "department": department,
        "priority": predicted_priority
    }


@router.get("/all")
def get_complaints(current_user: dict = Depends(get_current_user)):

    if current_user["role"] == "user":
        complaints = list(complaints_collection.find(
            {"user_email": current_user["email"]},
            {"_id":1, "department":1, "description":1, "location":1, "status":1, "image":1, "priority":1}
        ))
    else:
        complaints = list(complaints_collection.find(
            {},
            {"_id":1, "department":1, "description":1, "location":1, "status":1, "image":1, "user_email":1, "priority":1}
        ))

        priority_order = {"High": 1, "Medium": 2, "Low": 3}
        complaints.sort(key=lambda c: priority_order.get(c.get("priority", "Low"), 4))

    for c in complaints:
        c["_id"] = str(c["_id"])

    return complaints


@router.put("/update-status/{complaint_id}")
def update_status(
    complaint_id: str,
    status: str = Form(...),
    note: str = Form(""), 
    current_user: dict = Depends(get_current_user)
):

    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    complaint = complaints_collection.find_one({"_id": ObjectId(complaint_id)})

    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    new_entry = {
        "status": status,
        "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "note": note
    }

    complaints_collection.update_one(
        {"_id": ObjectId(complaint_id)},
        {
            "$set": {"status": status},
            "$push": {"status_history": new_entry}
        }
    )

    return {"message": "Status updated with timeline"}


@router.get("/pending-feedback")
def get_pending_feedback(current_user: dict = Depends(get_current_user)):

    complaints = list(complaints_collection.find(
        {
            "user_email": current_user["email"],
            "status": "Resolved",
            "feedback_given": False
        }
    ))

    for c in complaints:
        c["_id"] = str(c["_id"])

    return complaints


@router.get("/user-list")
def get_user_complaints_for_chat(current_user: dict = Depends(get_current_user)):

    complaints = list(complaints_collection.find(
        {"user_email": current_user["email"]},
        {"_id": 1, "description": 1, "status": 1, "image": 1}
    ))

    return [
        {
            "id": str(c["_id"]),
            "title": c.get("description", "No description")[:30] + "...",
            "status": c.get("status", "Pending"),
            "image": c.get("image")
        }
        for c in complaints
    ]


@router.websocket("/ws/complaints")
async def complaints_ws(websocket: WebSocket):

    await websocket.accept()
    token = websocket.query_params.get("token")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_email = payload.get("sub")
    except JWTError:
        await websocket.close(code=1008)
        return

    try:
        while True:
            await websocket.receive_text()

            complaints = list(complaints_collection.find(
                {"user_email": user_email},
                {"_id": 1, "description": 1, "status": 1, "image": 1}
            ))

            formatted = [
                {
                    "id": str(c["_id"]),
                    "title": c["description"][:30] + "...",
                    "status": c["status"],
                    "image": c.get("image")
                }
                for c in complaints
            ]

            await websocket.send_json(formatted)

    except Exception as e:
        print("WebSocket closed:", e)
