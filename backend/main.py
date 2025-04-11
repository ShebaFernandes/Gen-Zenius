from fastapi import FastAPI, Form
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import os
import requests

# ✅ Import your local functions using transformers (no HF token needed)
from api.script import generate_script, generate_audio

app = FastAPI()

# ✅ Serve audio files from the "audio" folder
app.mount("/audio", StaticFiles(directory="audio"), name="audio")

# ✅ CORS setup for frontend (React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev: Use ["http://localhost:3000"] in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===================== 📜 SCRIPT & AUDIO ENDPOINTS =====================

class ScriptRequest(BaseModel):
    topic: str

@app.post("/generate-script")
def script(request: ScriptRequest):
    try:
        script_text = generate_script(request.topic)
        return {"script": script_text}
    except Exception as e:
        print("Script generation error:", e)
        return {"script": "Sorry, script generation failed."}

@app.post("/generate-audio")
def audio(request: ScriptRequest):
    try:
        audio_path = generate_audio(request.topic)
        return {"audio_url": audio_path}
    except Exception as e:
        print("Audio generation error:", e)
        return {"audio_url": ""}

# ===================== 🎨 TEXT TO IMAGE ENDPOINT =====================

COLAB_API_URL = "https://d8a9-35-197-155-236.ngrok-free.app/generate-image/"

@app.post("/text-to-image/")
def generate_image_from_colab(prompt: str = Form(...)):
    try:
        response = requests.post(COLAB_API_URL, data={"prompt": prompt})
        if response.status_code != 200:
            return {"error": "Failed to generate image from Colab"}

        with open("received_image.png", "wb") as f:
            f.write(response.content)

        return FileResponse("received_image.png", media_type="image/png")

    except Exception as e:
        return {"error": str(e)}

# ===================== 🔁 PING TEST =====================

@app.get("/ping")
def ping():
    return {"message": "pong"}
