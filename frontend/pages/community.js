"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const API = "https://ai-website-builder-saas.onrender.com";

export default function CommunityPage() {

  const [projects, setProjects] = useState([]);
  const [active, setActive] = useState(null);
  const [menu, setMenu] = useState(false);

  const getDate = (p) => p.created_at || p.createdAt;

  const fetchProjects = async () => {

    try {

      const res = await fetch(`${API}/community-projects`);
      const data = await res.json();

      setProjects(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error(err);
      toast.error("Failed to load projects");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const deleteProject = async (id) => {

    try {

      await fetch(`${API}/delete-project/${id}`, {
        method: "DELETE",
      });

      toast.success("Deleted");
      setMenu(false);
      setActive(null);
      fetchProjects();

    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  const copyHTML = async (html) => {

    try {

      await navigator.clipboard.writeText(html);
      toast.success("Copied");
      setMenu(false);

    } catch (err) {
      toast.error("Copy failed");
    }
  };

  if (active) {

    return (
      <div style={{ position: "relative", height: "100vh" }}>

        <div
          onClick={() => setMenu(!menu)}
          style={{
            position: "absolute",
            top: 15,
            right: 20,
            fontSize: 22,
            cursor: "pointer",
            color: "#444",
            zIndex: 1000
          }}
        >
          ⋮
        </div>

        {menu && (
          <div
            style={{
              position: "absolute",
              top: 45,
              right: 20,
              background: "#1f2937",
              borderRadius: 8,
              overflow: "hidden",
              zIndex: 1000,
              minWidth: 110
            }}
          >

            <div
              onClick={() => copyHTML(active.html)}
              style={{ padding: "10px 15px", cursor: "pointer", color: "white" }}
            >
              Copy
            </div>

            <div
              onClick={() => deleteProject(active.id)}
              style={{ padding: "10px 15px", cursor: "pointer", color: "white" }}
            >
              Delete
            </div>

          </div>
        )}

        <iframe
          style={{ width: "100%", height: "100%", border: "none" }}
          srcDoc={`
            <style>
              html,body{margin:0;padding:0;overflow:auto;}
              ::-webkit-scrollbar{display:none;}
            </style>
            ${active.html}
          `}
        />

      </div>
    );
  }

  return (
    <div className="project-grid">

      {projects.map((p) => (

        <div
          key={p.id}
          className="project-card"
          onClick={() => setActive(p)}
        >

          <div className="project-title">
            {p.title || p.prompt}
          </div>

          <div className="project-date">
            {getDate(p)
              ? new Date(getDate(p)).toLocaleDateString()
              : "No Date"}
          </div>

        </div>

      ))}

    </div>
  );
}