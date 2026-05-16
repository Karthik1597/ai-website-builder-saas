import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function CommunityPage() {
  const [projects, setProjects] = useState([]);
  const [active, setActive] = useState(null);
  const [menu, setMenu] = useState(false);

  const fetchProjects = async () => {
    const res = await fetch("http://localhost:5000/community-projects");
    const data = await res.json();
    setProjects(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const deleteProject = async (id) => {
    await fetch(`http://localhost:5000/delete-project/${id}`, {
      method: "DELETE",
    });
    toast.success("Deleted");
    setMenu(false);
    setActive(null);
    fetchProjects();
  };

  const copyHTML = (html) => {
    navigator.clipboard.writeText(html);
    toast.success("Copied");
    setMenu(false);
  };

  if (active)
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
              style={{
                padding: "10px 15px",
                cursor: "pointer",
                color: "white"
              }}
            >
              Copy
            </div>
            <div
              onClick={() => deleteProject(active.id)}
              style={{
                padding: "10px 15px",
                cursor: "pointer",
                color: "white"
              }}
            >
              Delete
            </div>
          </div>
        )}

        <iframe
          style={{
            width: "100%",
            height: "100%",
            border: "none"
          }}
          srcDoc={`
            <style>
              html,body{
                margin:0;
                padding:0;
                overflow:auto;
                scrollbar-width:none;
              }
              ::-webkit-scrollbar{display:none}
            </style>
            ${active.html}
          `}
        />
      </div>
    );

  return (
    <div className="project-grid">
      {projects.map((p) => (
        <div
          key={p.id}
          className="project-card"
          onClick={() => setActive(p)}
        >
          <div className="project-title">{p.title || p.prompt}</div>
          <div className="project-date">
            {new Date(p.createdAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}