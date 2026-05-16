"use client";

import { useState } from "react";
import { toast } from "react-toastify";

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

      const res = await fetch(
        "http://localhost:5000/generate",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            prompt,
          }),
        }
      );

      const data = await res.json();

      if (!data.html) {

        toast.error("AI did not return valid HTML");

        setLoading(false);

        return;
      }

      setAiHtml(data.html);

      setGenerated(true);

      toast.success(
        "Professional website generated"
      );

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

      const res = await fetch(
        "http://localhost:5000/generate",
        {
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
        }
      );

      const data = await res.json();

      if (!data.html) {

        toast.error("Edit failed");

        setLoading(false);

        return;
      }

      setAiHtml(data.html);

      setEditInstruction("");

      toast.success(
        "Website updated successfully"
      );

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

      const res = await fetch(
        "http://localhost:5000/save-project",
        {
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
        }
      );

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
          paddingBottom: "60px"
        }}
      >

        <div className="ai-header">
          <h1>AI Website Preview</h1>

          <p>
            Your generated website preview below.
          </p>
        </div>

        <div
          style={{
            width: "100%",
            marginTop: "30px",
            borderRadius: "20px",
            overflow: "hidden",
            background: "#0f172a",
            boxShadow:
              "0 30px 80px rgba(0,0,0,0.6)",
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

                    body::-webkit-scrollbar,
                    html::-webkit-scrollbar {
                      width: 8px;
                    }

                    body::-webkit-scrollbar-thumb,
                    html::-webkit-scrollbar-thumb {
                      background: rgba(255,255,255,0.2);
                      border-radius: 10px;
                    }

                    body {
                      scrollbar-width: thin;
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
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.6)",
          }}
        >

          <h3
            style={{
              marginBottom: "15px",
              fontSize: "18px"
            }}
          >
            Edit Website
          </h3>

          <textarea
            value={editInstruction}

            onChange={(e) =>
              setEditInstruction(e.target.value)
            }

            style={{
              width: "100%",
              minHeight: "120px",
              borderRadius: "14px",
              padding: "14px",
              background: "#1e293b",
              color: "#fff",
              border: "1px solid #334155",
              fontSize: "15px",
              outline: "none",
            }}
          />

          <button
            onClick={handleEdit}

            disabled={loading}

            style={{
              marginTop: "18px",
              padding: "12px 28px",
              borderRadius: "12px",
              border: "none",
              fontWeight: "600",
              cursor: "pointer",
              background:
                "linear-gradient(135deg,#6366f1,#8b5cf6)",
              color: "#fff",
            }}
          >
            {loading
              ? "Updating..."
              : "Apply Edit"}
          </button>

        </div>

        {/* SAVE */}

        <div
          style={{
            marginTop: "35px",
            padding: "25px",
            borderRadius: "18px",
            background: "#111827",
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.6)",
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >

          <button
            onClick={() =>
              handleSave("private")
            }

            disabled={saving}

            style={{
              padding: "12px 28px",
              borderRadius: "12px",
              border: "none",
              fontWeight: "600",
              cursor: "pointer",
              background:
                "linear-gradient(135deg,#10b981,#059669)",
              color: "#fff",
            }}
          >
            Save as Private
          </button>

          <button
            onClick={() =>
              handleSave("public")
            }

            disabled={saving}

            style={{
              padding: "12px 28px",
              borderRadius: "12px",
              border: "none",
              fontWeight: "600",
              cursor: "pointer",
              background:
                "linear-gradient(135deg,#f59e0b,#ef4444)",
              color: "#fff",
            }}
          >
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

        <p>
          Describe your idea — AI builds
          a complete professional website.
        </p>

      </div>

      <div className="ai-prompt-box">

        <textarea
          placeholder="Create a modern SaaS startup website with pricing and testimonials"

          value={prompt}

          onChange={(e) =>
            setPrompt(e.target.value)
          }
        />

        <button
          onClick={handleGenerate}

          disabled={loading}
        >
          {loading
            ? "Generating Professional Website..."
            : "Generate Website"}
        </button>

      </div>

    </div>
  );
}