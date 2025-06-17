from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
from datetime import datetime
import uuid
import os

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize data.json
try:
    if not os.path.exists('data.json'):
        with open('data.json', 'w') as f:
            json.dump({"modules": {}}, f)
    
    with open('data.json', 'r') as f:
        db = json.load(f)
except Exception as e:
    print(f"Error loading data.json: {e}")
    db = {"modules": {}}

class Review(BaseModel):
    author: str
    content: str
    rating: int
    module_code: str

class Reply(BaseModel):
    author: str
    content: str
    review_id: str
    module_code: str

@app.get("/modules/{module_code}/reviews")
async def get_reviews(module_code: str):
    if module_code not in db["modules"]:
        return {}
    return db["modules"][module_code].get("reviews", {})

@app.post("/reviews")
async def create_review(review: Review):
    try:
        if review.module_code not in db["modules"]:
            db["modules"][review.module_code] = {"reviews": {}}
        
        review_id = str(uuid.uuid4())
        db["modules"][review.module_code]["reviews"][review_id] = {
            "id": review_id,
            "author": review.author,
            "timestamp": datetime.now().isoformat(),
            "content": review.content,
            "rating": review.rating,
            "upvotes": 0,
            "replies": {}
        }
        
        with open('data.json', 'w') as f:
            json.dump(db, f)
        
        return {"status": "success", "review_id": review_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/replies")
async def create_reply(reply: Reply):
    try:
        if reply.module_code not in db["modules"]:
            raise HTTPException(status_code=404, detail="Module not found")
        if reply.review_id not in db["modules"][reply.module_code]["reviews"]:
            raise HTTPException(status_code=404, detail="Review not found")
        
        reply_id = str(uuid.uuid4())
        db["modules"][reply.module_code]["reviews"][reply.review_id]["replies"][reply_id] = {
            "id": reply_id,
            "author": reply.author,
            "timestamp": datetime.now().isoformat(),
            "content": reply.content,
            "upvotes": 0
        }
        
        with open('data.json', 'w') as f:
            json.dump(db, f)
        
        return {"status": "success", "reply_id": reply_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/reviews/{review_id}/upvote")
async def upvote_review(review_id: str, module_code: str):
    try:
        if module_code not in db["modules"]:
            raise HTTPException(status_code=404, detail="Module not found")
        if review_id not in db["modules"][module_code]["reviews"]:
            raise HTTPException(status_code=404, detail="Review not found")
        
        db["modules"][module_code]["reviews"][review_id]["upvotes"] += 1
        
        with open('data.json', 'w') as f:
            json.dump(db, f)
        
        return {"status": "success", "new_count": db["modules"][module_code]["reviews"][review_id]["upvotes"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/replies/{reply_id}/upvote")
async def upvote_reply(reply_id: str, module_code: str, review_id: str):
    try:
        if module_code not in db["modules"]:
            raise HTTPException(status_code=404, detail="Module not found")
        if review_id not in db["modules"][module_code]["reviews"]:
            raise HTTPException(status_code=404, detail="Review not found")
        if reply_id not in db["modules"][module_code]["reviews"][review_id]["replies"]:
            raise HTTPException(status_code=404, detail="Reply not found")
        
        db["modules"][module_code]["reviews"][review_id]["replies"][reply_id]["upvotes"] += 1
        
        with open('data.json', 'w') as f:
            json.dump(db, f)
        
        return {"status": "success", "new_count": db["modules"][module_code]["reviews"][review_id]["replies"][reply_id]["upvotes"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/debug")
async def debug():
    return db