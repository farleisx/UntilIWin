import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <div className="max-w-3xl text-center px-6">
        <h1 className="text-5xl font-extrabold mb-4">Infiner — AI Website Builder</h1>
        <p className="mb-6 text-lg opacity-90">
          Generate web pages, live-preview code and iterate — all powered by AI.
        </p>
        <div className="flex gap-4 justify-center">
          <button onClick={() => navigate("/login")}
            className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold shadow">
            Start Building
          </button>
        </div>
      </div>
    </div>
  );
}
