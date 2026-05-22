import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Users() {
  const router = useRouter();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn");

    // 🔒 protect route
    if (!adminLoggedIn) {
      router.push("/admin/login");
      return;
    }

    // ✅ fetch users (replace API if needed)
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          "https://ai-website-builder-saas.onrender.com/users"
        );

        const data = await res.json();
        setUsers(data.users || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div style={{ padding: "20px", color: "#fff" }}>
      <h1>Users Page</h1>

      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
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
            <p>Name: {u.name}</p>
            <p>Email: {u.email}</p>
          </div>
        ))
      )}
    </div>
  );
}