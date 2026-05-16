import { useEffect, useState } from "react";

export default function UsersPage() {

  const [users, setUsers] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const loadUsers = async () => {

    const res = await fetch(
      "http://localhost:5001/admin/users"
    );

    const data = await res.json();

    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const deleteUser = async (id) => {

    const confirmDelete =
      confirm("Delete this user?");

    if (!confirmDelete) return;

    await fetch(
      `http://localhost:5001/admin/users/${id}`,
      {
        method: "DELETE",
      }
    );

    loadUsers();
  };

  const filteredUsers =
    users.filter((user) =>
      user.email
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#020617,#0f172a)",
        color: "#fff",
        padding: "40px",
      }}
    >

      <h1
        style={{
          fontSize: "38px",
          marginBottom: "20px",
        }}
      >
        👥 Users Management
      </h1>

      <input
        placeholder="Search email..."

        value={search}

        onChange={(e) =>
          setSearch(e.target.value)
        }

        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "14px",
          borderRadius: "12px",
          border: "none",
          marginBottom: "30px",
          background: "#1e293b",
          color: "#fff",
        }}
      />

      <div
        style={{
          overflowX: "auto",
        }}
      >

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#111827",
            borderRadius: "20px",
            overflow: "hidden",
          }}
        >

          <thead
            style={{
              background: "#1e293b",
            }}
          >
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>

          <tbody>

            {filteredUsers.map((user) => (

              <tr key={user.id}>

                <td style={tdStyle}>
                  {user.id}
                </td>

                <td style={tdStyle}>
                  {user.name}
                </td>

                <td style={tdStyle}>
                  {user.email}
                </td>

                <td style={tdStyle}>

                  <button
                    onClick={() =>
                      deleteUser(user.id)
                    }

                    style={{
                      padding:
                        "10px 18px",
                      border: "none",
                      borderRadius: "10px",
                      background: "#ef4444",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

const thStyle = {
  padding: "18px",
  textAlign: "left",
};

const tdStyle = {
  padding: "18px",
  borderTop:
    "1px solid rgba(255,255,255,0.06)",
};