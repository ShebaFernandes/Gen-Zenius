from transformers import pipeline, set_seed
import pyttsx3
import os
from uuid import uuid4

# Set up GPT-2 locally
generator = pipeline("text-generation", model="gpt2")
set_seed(42)

# ✅ Script generation using local GPT-2
def generate_script(topic: str) -> str:
    prompt = f"Explain the topic '{topic}' in a short educational script."
    result = generator(prompt, max_length=200, num_return_sequences=1)
    return result[0]["generated_text"]

# 🎙️ Generate audio from text
def generate_audio(text: str) -> str:
    engine = pyttsx3.init()
    filename = f"{uuid4()}.mp3"
    folder = "audio"
    filepath = os.path.join(folder, filename)

    os.makedirs(folder, exist_ok=True)
    engine.save_to_file(text, filepath)
    engine.runAndWait()

    return f"http://localhost:8000/audio/{filename}"