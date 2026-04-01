# from pymongo import MongoClient

# MONGO_URI = "mongodb://localhost:27017"

# client = MongoClient(MONGO_URI)

# db = client["ai_cityserve"]

# users_collection = db["users"]
# complaints_collection = db["complaints"]

# requests_collection = db["service_requests"]

from pymongo import MongoClient

MONGO_URI = "mongodb://localhost:27017"

client = MongoClient(MONGO_URI)
db = client["ai_cityserve"]

users_collection = db["users"]
complaints_collection = db["complaints"]
requests_collection = db["service_requests"]

# NEW COLLECTION
feedback_collection = db["feedback"]