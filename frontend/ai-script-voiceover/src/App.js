import React, { useState, useEffect } from "react";
import ScriptForm from "./components/ScriptForm";
import AudioPlayer from "./components/AudioPlayer";
import "./App.css";
import axios from "axios";

function App() {
  const [script, setScript] = useState("");
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/ping")
      .then((res) => console.log(res.data))
      .catch((err) => console.error("Ping error:", err));
  }, []);

  const handleGenerateImage = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/text-to-image/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ prompt }),
      });

      if (!response.ok) throw new Error("Image generation failed.");
      const blob = await response.blob();
      setImage(URL.createObjectURL(blob));
    } catch (error) {
      alert("Something went wrong!");
      console.error("ERROR:", error);
    }
  };

  return (
    <div
      className="App"
      style={{
        textAlign: "center",
        padding: "2rem",
        background: "#0f0f0f",
        color: "#fff",
        minHeight: "100vh",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <h1 style={{ color: "#00ffff" }}>🧠 AI Script + Voiceover Generator</h1>
      <div style={{ background: "#1a1a1a", padding: "20px", borderRadius: "12px", boxShadow: "0 0 12px #222" }}>
        <ScriptForm onScriptGenerated={setScript} />
        {script && <AudioPlayer script={script} />}
      </div>

      <hr style={{ margin: "50px 0", borderColor: "#444" }} />

      <h1 style={{ color: "#ffa500" }}>🎨 Text to Image Generator</h1>
      <div style={{ background: "#1a1a1a", padding: "20px", borderRadius: "12px", display: "inline-block" }}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter prompt for image generation"
          style={{
            width: "300px",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #555",
            background: "#000",
            color: "#fff",
          }}
        />
        <button
          onClick={handleGenerateImage}
          style={{
            marginLeft: "10px",
            padding: "10px 20px",
            borderRadius: "6px",
            background: "#00bcd4",
            color: "#000",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.background = "#00ffff")}
          onMouseOut={(e) => (e.target.style.background = "#00bcd4")}
        >
          Generate
        </button>
      </div>

      <div style={{ marginTop: "30px" }}>
        {image && (
          <img
            src={image}
            alt="Generated"
            width={400}
            style={{ borderRadius: "12px", boxShadow: "0 0 20px #444" }}
          />
        )}
      </div>
    </div>
  );
}

export default App;
