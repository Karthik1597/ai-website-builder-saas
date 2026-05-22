import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Users() {
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // edit modal states
  const [editingUser, setEditingUser] =
    useState(null);

  const [editName, setEditName] =
    useState("");

  const [editEmail, setEditEmail] =
    useState("");

  /* ======================================
     AUTH + FETCH USERS
  ====================================== */

  useEffect(() => {
    const adminLoggedIn =
      localStorage.getItem(
        "adminLoggedIn"
      );

    // 🔒 protect admin page
    if (!adminLoggedIn) {
      router.push("/admin/login");
      return;
    }

    fetchUsers();
  }, []);

  /* ======================================
     FETCH USERS
  ====================================== */

  const fetchUsers = async () => {
    try {
      const res = await fetch(
        "https://ai-website-builder-saas.onrender.com/admin/users"
      );

      const data = await res.json();

      console.log("USERS:", data);

      setUsers(data || []);
    } catch (err) {
      console.error(
        "Fetch users error:",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  /* ======================================
     DELETE USER
  ====================================== */

  const deleteUser = async (id) => {
    const confirmDelete =
      confirm(
        "Are you sure you want to delete this user?"
      );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `https://ai-website-builder-saas.onrender.com/admin/users/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("User deleted");

        // refresh users
        fetchUsers();
      } else {
        alert("Delete failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  /* ======================================
     OPEN EDIT MODAL
  ====================================== */

  const openEditModal = (user) => {
    setEditingUser(user);

    setEditName(user.name);

    setEditEmail(user.email);
  };

  /* ======================================
     UPDATE USER
  ====================================== */

  const updateUser = async () => {
    try {
      const res = await fetch(
        `https://ai-website-builder-saas.onrender.com/admin/users/${editingUser.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name: editName,
            email: editEmail,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("User updated");

        setEditingUser(null);

        fetchUsers();
      } else {
        alert("Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        padding: "30px",
        color: "#fff",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
          }}
        >
          Users Database
        </h1>

        <button
          onClick={() => {
            localStorage.removeItem(
              "adminLoggedIn"
            );

            router.push(
              "/admin/login"
            );
          }}
          style={{
            padding:
              "10px 18px",
            background: "#ef4444",
            border: "none",
            color: "#fff",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* LOADING */}

      {loading && (
        <p>Loading users...</p>
      )}

      {/* EMPTY */}

      {!loading &&
        users.length === 0 && (
          <p>No users found</p>
        )}

      {/* USERS TABLE */}

      {!loading &&
        users.length > 0 && (
          <div
            style={{
              overflowX: "auto",
              background:
                "#111827",
              borderRadius:
                "18px",
              padding: "20px",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse:
                  "collapse",
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
                      padding:
                        "14px",
                      textAlign:
                        "left",
                    }}
                  >
                    ID
                  </th>

                  <th
                    style={{
                      padding:
                        "14px",
                      textAlign:
                        "left",
                    }}
                  >
                    Name
                  </th>

                  <th
                    style={{
                      padding:
                        "14px",
                      textAlign:
                        "left",
                    }}
                  >
                    Email
                  </th>

                  <th
                    style={{
                      padding:
                        "14px",
                      textAlign:
                        "left",
                    }}
                  >
                    Created
                  </th>

                  <th
                    style={{
                      padding:
                        "14px",
                      textAlign:
                        "left",
                    }}
                  >
                    Actions
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
                        padding:
                          "14px",
                      }}
                    >
                      {u.id}
                    </td>

                    <td
                      style={{
                        padding:
                          "14px",
                      }}
                    >
                      {u.name}
                    </td>

                    <td
                      style={{
                        padding:
                          "14px",
                      }}
                    >
                      {u.email}
                    </td>

                    <td
                      style={{
                        padding:
                          "14px",
                      }}
                    >
                      {new Date(
                        u.created_at
                      ).toLocaleString()}
                    </td>

                    {/* ACTION BUTTONS */}

                    <td
                      style={{
                        padding:
                          "14px",
                        display:
                          "flex",
                        gap: "10px",
                      }}
                    >
                      {/* EDIT */}

                      <button
                        onClick={() =>
                          openEditModal(
                            u
                          )
                        }
                        style={{
                          padding:
                            "8px 14px",
                          background:
                            "#3b82f6",
                          border:
                            "none",
                          color:
                            "#fff",
                          borderRadius:
                            "8px",
                          cursor:
                            "pointer",
                        }}
                      >
                        Edit
                      </button>

                      {/* DELETE */}

                      <button
                        onClick={() =>
                          deleteUser(
                            u.id
                          )
                        }
                        style={{
                          padding:
                            "8px 14px",
                          background:
                            "#ef4444",
                          border:
                            "none",
                          color:
                            "#fff",
                          borderRadius:
                            "8px",
                          cursor:
                            "pointer",
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
        )}

      {/* ======================================
          EDIT MODAL
      ====================================== */}

      {editingUser && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent:
              "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "400px",
              background:
                "#111827",
              padding: "30px",
              borderRadius:
                "16px",
            }}
          >
            <h2
              style={{
                marginBottom:
                  "20px",
              }}
            >
              Edit User
            </h2>

            <input
              value={editName}
              onChange={(e) =>
                setEditName(
                  e.target.value
                )
              }
              placeholder="Name"
              style={{
                width: "100%",
                padding: "12px",
                marginBottom:
                  "15px",
                borderRadius:
                  "8px",
                border: "none",
              }}
            />

            <input
              value={editEmail}
              onChange={(e) =>
                setEditEmail(
                  e.target.value
                )
              }
              placeholder="Email"
              style={{
                width: "100%",
                padding: "12px",
                marginBottom:
                  "20px",
                borderRadius:
                  "8px",
                border: "none",
              }}
            />

            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
            >
              <button
                onClick={updateUser}
                style={{
                  flex: 1,
                  padding:
                    "12px",
                  background:
                    "#22c55e",
                  border: "none",
                  color: "#fff",
                  borderRadius:
                    "10px",
                  cursor:
                    "pointer",
                }}
              >
                Save
              </button>

              <button
                onClick={() =>
                  setEditingUser(
                    null
                  )
                }
                style={{
                  flex: 1,
                  padding:
                    "12px",
                  background:
                    "#6b7280",
                  border: "none",
                  color: "#fff",
                  borderRadius:
                    "10px",
                  cursor:
                    "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}