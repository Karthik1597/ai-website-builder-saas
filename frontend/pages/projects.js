"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const API = "https://ai-website-builder-saas.onrender.com";

export default function ProjectsPage() {

  const [projects, setProjects] = useState([]);
  const [active, setActive] = useState(null);
  const [menu, setMenu] = useState(false);

  const getDate = (p) => p.created_at || p.createdAt;

  const fetchProjects = async () => {

    try {

      const res = await fetch(`${API}/my-projects`);
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

        <button
          onClick={() => {
            setActive(null);
            setMenu(false);
          }}
          style={{
            position: "absolute",
            top: 15,
            left: 15,
            zIndex: 1000,
            padding: "10px 18px",
            border: "none",
            borderRadius: "10px",
            background: "#111827",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Back
        </button>

        <div
          onClick={() => setMenu(!menu)}
          style={{
            position: "absolute",
            top: 15,
            right: 20,
            fontSize: 28,
            cursor: "pointer",
            zIndex: 1000
          }}
        >
          ⋮
        </div>

        {menu && (
          <div
            style={{
              position: "absolute",
              top: 50,
              right: 20,
              background: "#111827",
              borderRadius: "12px",
              overflow: "hidden",
              zIndex: 1000,
              minWidth: "140px"
            }}
          >

            <div
              onClick={() => copyHTML(active.html)}
              style={{ padding: "12px 16px", color: "#fff", cursor: "pointer" }}
            >
              Copy 
            </div>

            <div
              onClick={() => deleteProject(active.id)}
              style={{ padding: "12px 16px", color: "#ff4d4f", cursor: "pointer" }}
            >
              Delete
            </div>

          </div>
        )}

        <iframe
          title="preview"
          srcDoc={active.html}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            background: "#fff"
          }}
        />

      </div>
    );
  }

  return (
    <div
      style={{
        padding: "30px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
        gap: "20px",
      }}
    >

      {projects.length === 0 && <h2>No Saved Projects</h2>}

      {projects.map((p) => (

        <div
          key={p.id}
          onClick={() => setActive(p)}
          style={{
            padding: "20px",
            borderRadius: "18px",
            background: "#111827",
            color: "#fff",
            cursor: "pointer",
          }}
        >

          <h3>{p.title}</h3>

          <p style={{ opacity: 0.7, fontSize: "14px" }}>
            {getDate(p)
              ? new Date(getDate(p)).toLocaleString()
              : "No Date"}
          </p>

          <p style={{
            marginTop: "10px",
            color: p.visibility === "public" ? "#f59e0b" : "#10b981"
          }}>
            {p.visibility}
          </p>

        </div>

      ))}

    </div>
  );
}