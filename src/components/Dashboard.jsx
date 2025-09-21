import React, { useState } from "react";
import axios from "axios";
import CodeEditor from "./CodeEditor";

export default function Dashboard() {
  const [prompt, setPrompt] = useState("");
  const [aiText, setAiText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setError("");
    if (!prompt.trim()) { setError("Type a prompt first."); return; }
    setLoading(true);
    try {
      const res = await axios.post("/api/ai", { prompt });
      if (res.data?.text) setAiText(res.data.text);
      else setAiText(JSON.stringify(res.data).slice(0, 5000));
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen">
      <CodeEditor code={aiText} />
      <aside className="w-1/3 p-4 bg-gray-50 border-l">
        <h3 className="text-xl font-semibold mb-2">AI Agent</h3>
        <textarea
          placeholder='e.g. "Create a responsive landing page with a hero, features and footer"'
          className="w-full h-40 p-2 border rounded mb-3"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button onClick={handleGenerate}
          className="w-full py-2 mb-3 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          disabled={loading}>
          {loading ? "Generating..." : "Generate"}
        </button>

        {error && <div className="text-red-600 mb-2">{error}</div>}
        <div className="text-sm text-gray-700">
          The generated HTML appears in the editor automatically — edit it and the preview updates instantly.
        </div>
      </aside>
    </div>
  );
}
