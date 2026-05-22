import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Users() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn");

    // 🔒 protect route
    if (!adminLoggedIn) {
      router.push("/admin/login");
      return;
    }

    // ✅ fetch users
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          "https://ai-website-builder-saas.onrender.com/admin/users"
        );

        const data = await res.json();

        console.log("USERS API RESPONSE:", data);

        // ✅ backend returns ARRAY directly
        setUsers(data || []);
      } catch (err) {
        console.error("Fetch users error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div style={{ padding: "20px", color: "#fff" }}>
      <h1>Users Page</h1>

      {/* loading state */}
      {loading && <p>Loading users...</p>}

      {/* no users */}
      {!loading && users.length === 0 && (
        <p>No users found</p>
      )}

      {/* users list */}
      {!loading &&
        users.length > 0 &&
        users.map((u, i) => (
          <div
            key={i}
            style={{
              padding: "10px",
              margin: "10px 0",
              background: "#111827",
              borderRadius: "10px",
            }}
          >
            <p><b>Name:</b> {u.name}</p>
            <p><b>Email:</b> {u.email}</p>
          </div>
        ))}
    </div>
  );
}