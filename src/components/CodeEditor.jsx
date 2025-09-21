import React, { useEffect, useState } from "react";

export default function CodeEditor({ code }) {
  const defaultTemplate = `<!doctype html>
<html>
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Preview</title>
    <style>body{font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;padding:2rem}</style>
  </head>
  <body>
    <h1>Hello — Live Preview</h1>
    <p>Edit the HTML on the left and see the result here.</p>
  </body>
</html>`;

  const [editorHtml, setEditorHtml] = useState(defaultTemplate);

  useEffect(() => {
    if (code && code.trim()) {
      const trimmed = code.trim();
      if (trimmed.startsWith("<")) setEditorHtml(trimmed);
      else {
        setEditorHtml(
          `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Preview</title></head><body><pre>${escapeHtml(trimmed)}</pre></body></html>`
        );
      }
    }
  }, [code]);

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  }

  return (
    <div className="w-2/3 h-full flex">
      <div className="w-1/2 p-4 border-r overflow-auto">
        <div className="mb-2 text-sm text-gray-600">HTML Editor</div>
        <textarea
          className="w-full h-[calc(100vh-4rem)] p-2 border rounded code-area font-mono text-sm"
          value={editorHtml}
          onChange={(e) => setEditorHtml(e.target.value)}
        />
      </div>
      <div className="w-1/2">
        <div className="text-sm p-2 border-b text-gray-600">Live Preview</div>
        <iframe
          title="live-preview"
          srcDoc={editorHtml}
          className="w-full h-[calc(100vh-2rem)] border-0"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
}
