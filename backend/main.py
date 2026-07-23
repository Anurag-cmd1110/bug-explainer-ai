# backend/main.py
import os
import datetime
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from google.genai import types
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import httpx

# 1. Load environment variables
load_dotenv()

app = FastAPI(title="Bug Explainer AI Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Initialize the Gemini client
client = genai.Client()

# Global database pointers
db_client: Optional[AsyncIOMotorClient] = None
db = None

# 3. Initialize native MongoDB Client on App Startup
@app.on_event("startup")
async def startup_db_client():
    global db_client, db
    mongo_url = os.environ.get("MONGODB_URL")
    if not mongo_url:
        raise ValueError("CRITICAL: MONGODB_URL environment variable is missing!")
    
    # Initialize the direct native async connection client
    db_client = AsyncIOMotorClient(mongo_url)
    db_name = mongo_url.split("/")[-1].split("?")[0] or "bug_observability"
    db = db_client[db_name]
    print(f"🔌 Connected via Native Motor to MongoDB Atlas: {db_name}")

@app.on_event("shutdown")
async def shutdown_db_client():
    if db_client:
        db_client.close()

# Helper to format MongoDB ObjectIds into strings for the API JSON responses
def serialize_mongo_doc(doc):
    if not doc:
        return None
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc

@app.get("/")
async def root():
    return {"status": "online", "message": "AI Observability Backend running directly via Motor"}

# 4. Ingestion Route (Saves straight to raw MongoDB collection)
# 4. Ingestion Route (Dynamically intercepts raw payloads or handles simulations)
@app.post("/api/v1/logs")
async def receive_error_log(payload: dict):
    try:
        # Check if the frontend requested a live runtime crash simulation
        execution_mode = payload.get("mode", "analyze")
        
        if execution_mode == "crash":
            # Formulate an active production failure context mapping to the user's targeted repo file
            target_file = payload.get("file_path", "src/App.tsx")
            error_message = "TypeError: Cannot read properties of undefined (reading 'map')"
            stack_trace = (
                f"TypeError: Cannot read properties of undefined (reading 'map')\n"
                f"    at render (frontend/{target_file}:45:24)\n"
                f"    at Object.executeAction (node_modules/react-dom/cjs/react-dom.production.min.js:244:12)\n"
                f"    at processTicksAndRejections (node:internal/process/task_queues:95:5)"
            )
            line_number = 45
        else:
            # Clean predictive audit mode
            error_message = payload.get("error_message", "Static Code Quality Scan Request")
            stack_trace = payload.get("stack_trace", "Executing static predictive crash audit logic.")
            line_number = 0
            target_file = payload.get("file_path", "src/App.tsx")

        log_doc = {
            "project_id": payload.get("project_id", "unknown"),
            "error_message": error_message,
            "stack_trace": stack_trace,
            "file_path": target_file,
            "line_number": line_number,
            "environment": payload.get("environment", "production"),
            "timestamp": payload.get("timestamp") or datetime.datetime.utcnow().isoformat(),
            "ai_analysis": None
        }
        
        result = await db["error_logs"].insert_one(log_doc)
        inserted_id = str(result.inserted_id)
        
        print(f"💾 TELEMETRY INSIGHT PERSISTED TO MONGO ATLAS: {log_doc['error_message']}")
        return {
            "status": "success", 
            "message": "Error log captured successfully",
            "log_id": inserted_id
        }
    except Exception as e:
        print(f"❌ DATABASE INGESTION ERROR DETAILS: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database ingestion crash: {str(e)}")
# 5. Fetch All Logs route
@app.get("/api/v1/logs")
async def get_all_logs():
    cursor = db["error_logs"].find().sort("timestamp", -1)
    logs = await cursor.to_list(length=100)
    return {"logs": [serialize_mongo_doc(log) for log in logs]}

# 6. Resilient Gemini Analysis Route via Native DB lookup with live GitHub Context
@app.post("/api/v1/logs/{log_id}/analyze")
async def analyze_bug(log_id: str, github_url: Optional[str] = None):
    # Validate ObjectId format string safely
    try:
        obj_id = ObjectId(log_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid log ID format string")
        
    # Fetch log target from MongoDB natively
    bug = await db["error_logs"].find_one({"_id": obj_id})
    if not bug:
        raise HTTPException(status_code=404, detail="Error log registry target not found")
        
    code_context = "No live source code context provided."
    
    # If the user supplied a GitHub URL, let's pull the live file text!
    if github_url and "github.com" in github_url:
        try:
            print(f"📦 Fetching live source context from: {github_url}")
            # Convert standard web layout preview URLs into raw content data downloads
            raw_url = github_url.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/")
            
            async with httpx.AsyncClient() as client_http:
                response_http = await client_http.get(raw_url, timeout=10.0)
                if response_http.status_code == 200:
                    code_context = response_http.text
                    print("✅ Source file content successfully pulled into context memory!")
                else:
                    print(f"⚠️ Failed to fetch file from GitHub. Status code: {response_http.status_code}")
        except Exception as httpx_err:
            print(f"⚠️ GitHub context fetch failure: {str(httpx_err)}")

    # Advanced production-grade dual system instruction rules
    system_instruction = (
        "You are an advanced production-grade AI Code Auditor and Telemetry Observability Engine. "
        "Analyze the code context file and payload parameters thoroughly. "
        "1. If the error message indicates a crash, explain exactly 'Why It Crashed' and provide a concrete 'Corrected Code Patch'. "
        "2. If no active crash is detected (such as a pure code scan request), output a clear statement starting exactly with: "
        "'✅ Code Quality Analysis: No Active Crash Risk Found.' Follow up with a clear summary of its design patterns, "
        "performance optimizations, and code posture. Do not mention default placeholder code file contexts like "
        "'payment.js' if the user's uploaded code logic belongs to a different platform application structure."
    )
    
    user_content = f"""
    The application execution context has been loaded! Here are the tracking details:
    Target Scan Mode: {bug.get('error_message', '') if 'Scan' in bug.get('error_message', '') else 'Crash Debugging'}
    Log File Reference: {bug['file_path']}
    Line Number Context: {bug['line_number']}
    
    Stack Trace / Telemetry Details:
    {bug['stack_trace']}
    
    --- LIVE SOURCE CODE CONTEXT FILE ---
    {code_context}
    """
    
    model_pipeline_chain = ['gemini-3.5-flash', 'gemini-3-flash-preview']
    last_exception = None

    for model_name in model_pipeline_chain:
        try:
            print(f"🔄 Attempting diagnostic generation using target model: {model_name}...")
            response = client.models.generate_content(
                model=model_name,
                contents=user_content,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    temperature=0.2,
                )
            )
            
            ai_analysis = response.text
            
            # Update both the analysis text and the code context reference inside MongoDB Atlas natively
            await db["error_logs"].update_one(
                {"_id": obj_id},
                {"$set": {"ai_analysis": ai_analysis, "github_context_url": github_url}}
            )
            
            print(f"✅ Success! Analysis updated in DB using model: {model_name}")
            return {
                "status": "success",
                "log_id": log_id,
                "analysis": ai_analysis
            }
            
        except Exception as e:
            print(f"⚠️ Model {model_name} failed. Error details: {str(e)}")
            last_exception = e
            continue

    raise HTTPException(status_code=503, detail=f"All upstream endpoints overloaded: {str(last_exception)}")