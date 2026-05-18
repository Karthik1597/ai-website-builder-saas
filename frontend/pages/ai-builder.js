"use client";

import { useState } from "react";
import { toast } from "react-toastify";

const API = "https://ai-website-builder-saas.onrender.com";

export default function AiBuilderPage() {

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [aiHtml, setAiHtml] = useState("");
  const [editInstruction, setEditInstruction] = useState("");
  const [saving, setSaving] = useState(false);

  /* ============================
     GENERATE WEBSITE
  ============================ */

  const handleGenerate = async () => {

    if (!prompt.trim()) return;

    setLoading(true);

    try {

      const res = await fetch(`${API}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
      });

      const data = await res.json();

      if (!data.html) {
        toast.error("AI did not return valid HTML");
        setLoading(false);
        return;
      }

      setAiHtml(data.html);
      setGenerated(true);

      toast.success("Professional website generated");

    } catch (err) {
      console.error(err);
      toast.error("AI generation failed.");
    }

    setLoading(false);
  };

  /* ============================
     EDIT WEBSITE
  ============================ */

  const handleEdit = async () => {

    if (!editInstruction.trim()) return;

    setLoading(true);

    try {

      const res = await fetch(`${API}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `
Existing Website HTML:
${aiHtml}

EDIT INSTRUCTION:
${editInstruction}

Return full updated professional HTML website.
`,
        }),
      });

      const data = await res.json();

      if (!data.html) {
        toast.error("Edit failed");
        setLoading(false);
        return;
      }

      setAiHtml(data.html);
      setEditInstruction("");

      toast.success("Website updated successfully");

    } catch (err) {
      console.error(err);
      toast.error("Edit request failed");
    }

    setLoading(false);
  };

  /* ============================
     SAVE PROJECT
  ============================ */

  const handleSave = async (visibility) => {

    if (!aiHtml) return;

    setSaving(true);

    try {

      const res = await fetch(`${API}/save-project`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: prompt,
          prompt,
          html: aiHtml,
          visibility,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error("Save failed");
        setSaving(false);
        return;
      }

      toast.success(
        visibility === "private"
          ? "Saved to My Projects"
          : "Saved to Community"
      );

    } catch (err) {
      console.error(err);
      toast.error("Save failed");
    }

    setSaving(false);
  };

  /* ============================
     PREVIEW MODE
  ============================ */

  if (generated) {
    return (
      <div
        className="ai-builder container"
        style={{
          paddingTop: "40px",
          paddingBottom: "60px",
        }}
      >

        <div className="ai-header">
          <h1>AI Website Preview</h1>
          <p>Your generated website preview below.</p>
        </div>

        <div
          style={{
            width: "100%",
            marginTop: "30px",
            borderRadius: "20px",
            overflow: "hidden",
            background: "#0f172a",
            boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
          }}
        >

          <iframe
            title="AI Preview"
            sandbox="allow-scripts allow-same-origin"
            style={{
              width: "100%",
              height: "85vh",
              border: "none",
              display: "block",
              background: "#0f172a",
              overflow: "auto",
            }}
            srcDoc={`
              <html>
                <head>
                  <style>
                    html, body {
                      margin: 0;
                      padding: 0;
                      min-height: 100%;
                      overflow-y: auto;
                      overflow-x: hidden;
                      background: #0f172a;
                    }
                  </style>
                </head>
                <body>
                  ${aiHtml}
                </body>
              </html>
            `}
          />

        </div>

        <div style={{ height: "50px" }} />

        {/* EDIT */}
        <div
          style={{
            marginTop: "40px",
            padding: "25px",
            borderRadius: "18px",
            background: "#111827",
          }}
        >

          <h3>Edit Website</h3>

          <textarea
            value={editInstruction}
            onChange={(e) => setEditInstruction(e.target.value)}
            style={{
              width: "100%",
              minHeight: "120px",
              padding: "14px",
            }}
          />

          <button onClick={handleEdit} disabled={loading}>
            {loading ? "Updating..." : "Apply Edit"}
          </button>

        </div>

        {/* SAVE */}
        <div
          style={{
            marginTop: "35px",
            padding: "25px",
            display: "flex",
            gap: "20px",
          }}
        >

          <button onClick={() => handleSave("private")} disabled={saving}>
            Save as Private
          </button>

          <button onClick={() => handleSave("public")} disabled={saving}>
            Save as Public
          </button>

        </div>

      </div>
    );
  }

  /* ============================
     PROMPT MODE
  ============================ */

  return (
    <div className="ai-builder container">

      <div className="ai-header">
        <h1>AI Website Builder</h1>
        <p>Describe your idea — AI builds a complete website.</p>
      </div>

      <div className="ai-prompt-box">

        <textarea
          placeholder="Create a SaaS website..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating..." : "Generate Website"}
        </button>

      </div>

    </div>
  );
}