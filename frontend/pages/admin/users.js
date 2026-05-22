import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Users() {
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminLoggedIn =
      localStorage.getItem("adminLoggedIn");

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

        console.log("USERS:", data);

        setUsers(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        padding: "30px",
        color: "#fff",
      }}
    >
      <h1
        style={{
          fontSize: "32px",
          marginBottom: "30px",
        }}
      >
        Users Database
      </h1>

      {/* Loading */}
      {loading && (
        <p style={{ color: "#94a3b8" }}>
          Loading users...
        </p>
      )}

      {/* Empty */}
      {!loading && users.length === 0 && (
        <p style={{ color: "#94a3b8" }}>
          No users found
        </p>
      )}

      {/* Users Table */}
      {!loading && users.length > 0 && (
        <div
          style={{
            overflowX: "auto",
            background: "#111827",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom:
                    "1px solid #374151",
                }}
              >
                <th
                  style={{
                    textAlign: "left",
                    padding: "14px",
                  }}
                >
                  ID
                </th>

                <th
                  style={{
                    textAlign: "left",
                    padding: "14px",
                  }}
                >
                  Name
                </th>

                <th
                  style={{
                    textAlign: "left",
                    padding: "14px",
                  }}
                >
                  Email
                </th>

                <th
                  style={{
                    textAlign: "left",
                    padding: "14px",
                  }}
                >
                  Created At
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  style={{
                    borderBottom:
                      "1px solid #1f2937",
                  }}
                >
                  <td
                    style={{
                      padding: "14px",
                    }}
                  >
                    {u.id}
                  </td>

                  <td
                    style={{
                      padding: "14px",
                    }}
                  >
                    {u.name}
                  </td>

                  <td
                    style={{
                      padding: "14px",
                    }}
                  >
                    {u.email}
                  </td>

                  <td
                    style={{
                      padding: "14px",
                    }}
                  >
                    {new Date(
                      u.created_at
                    ).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}