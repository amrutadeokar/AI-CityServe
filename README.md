# 🚀 AI CityServe – Smart Civic Services Platform

## 📌 Overview

AI CityServe is a smart complaint management system that enhances communication between citizens and municipal authorities using Artificial Intelligence. The platform allows users to submit complaints with location and supporting evidence, track their status, and provide feedback, ensuring transparency and ease of use.
On the administrative side, the system automatically classifies complaints into relevant departments and prioritizes them using sentiment analysis. High-priority complaints are highlighted for immediate attention, while administrators can manage and update complaint statuses in real time.
The system also includes an analytics dashboard for monitoring complaint trends, along with additional features such as a chatbot, SOS functionality, and help support, making it a comprehensive and user-centric smart city solution.

---

## 🎯 Features

### 👤 User Module

* User registration and login
* File complaints with **location (map integration)**
* Upload evidence (images/files)
* Track complaints in **My Complaints**
* Submit feedback after resolution

---

### 👨‍💼 Admin Module

* View complaints **department-wise and priority-wise**
* Real-time complaint management
* Update complaint status:

  * Pending
  * In Progress
  * Resolved
* High priority complaints trigger **alert system**

---

### 🧠 AI Features

* Complaint classification using Machine Learning
* Sentiment analysis for priority detection
* Sentiment analysis for feedback submitted bu user
* Automatic routing to specific departments

---

### 📊 Analytics Dashboard

* Pie chart visualization of complaints
* Tracks:

  * Pending complaints
  * Resolved complaints
  * Active complaints
* Pie chart visualization of feedback sentiment analysis in positive, negative and neutral categories.
---

### 💬 Additional Features

* Chatbot for user assistance
* SOS emergency button
* Help & information section

---

## 🛠️ Tech Stack

Frontend:

* React.js
* HTML, CSS, JavaScript

Backend:

* Python (Flask)
* REST APIs

Machine Learning:

* NLP
* TF-IDF Vectorizer
* Scikit-learn

---

## ⚙️ Workflow

1. User submits complaint with location and evidence
2. Backend processes complaint
3. AI model:

   * Classifies complaints in specific department
   * Determines priority using sentiment
4. Complaint is stored and displayed
5. Admin monitors and updates status
6. Changes reflect on user dashboard
7. User can submit the feedback and the feedback is displayed on admin dashbaord along with sentiment of the feedback.
---

## 📂 Project Structure

```
AI-CityServe/
├── frontend/
├── backend/
├── README.md
├── .gitignore
```

---

## 📸 Screenshots

### 🏠 Landing Page
![Landing Page](images/LandingPage.png)

### 🔐 Login Page
![Login](images/login.png)

---

## 👤 User Module

### 👤 User Dashboard
![User Dashboard](images/UserDashboard.png)

### 📝 File Complaint Form
![Complaint Form](images/FileComplaintForm.png)

### 📝 File a complaint
![Complaint](images/Complaint-Filing.png)

### 📍 Location Integration
![Location](images/location.png)

### 🧠 AI Analysis
![AI Analysis](images/AI-analysis.png)

### 📋 User Complaints
![User Complaints](images/UserAllComplaints.png)

---

## 👨‍💼 Admin Module

### 👨‍💼 Admin Dashboard
![Admin Dashboard](images/AdminDashboard.png)

### 📊 Complaints Area Wise
![Area Wise](images/ComplaintsAreaWise.png)

### 🧠 Complaint Categorization
![Categorization](images/Compliant-categorization.png)

### 📋 Complaints on Admin Dashboard
![Admin Complaints](images/Complaints-Displayed-on-AdminDashboard.png)

### 📊 Analytics Dashboard
![Analytics](images/Analytics.png)

---

## 💬 Additional Features

### 🤖 Chatbot
![Chatbot](images/ChatBot.png)

### 📝 User Feedback
![User Feedback](images/UserFeedback.png)

### 📊 Feedback Analysis
![Feedback Analysis](images/FeedbackAnalysis.png)

### 🚨 SOS Service
![SOS](images/SOS-service.png)

---

## 🚀 How to Run

### Frontend

```
cd frontend
npm install
npm start
```

### Backend

```
cd backend
pip install -r requirements.txt
python main.py
```

---

## 👩‍💻 Author

Amruta Deokar

---

