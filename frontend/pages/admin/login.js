import { useState } from "react";

export default function AdminLogin() {

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleLogin = async () => {

    try {

      console.log("🔥 Login clicked");

      const res = await fetch(
        "https://ai-website-builder-saas.onrender.com/admin-login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await res.json();

      console.log("✅ RESPONSE:", data);

      if (data.success) {

        localStorage.setItem(
          "adminLoggedIn",
          "true"
        );

        window.location.href =
          "/admin/dashboard";

      } else {

        alert("Invalid login");
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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >

      <div
        style={{
          width: "400px",
          padding: "40px",
          background: "#111827",
          borderRadius: "20px",
        }}
      >

        <h1
          style={{
            color: "#fff",
            marginBottom: "20px",
          }}
        >
          Admin Login
        </h1>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
          style={{
            width: "100%",
            padding: "14px",
            marginBottom: "20px",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={{
            width: "100%",
            padding: "14px",
            marginBottom: "20px",
          }}
        />

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "14px",
            background: "#6366f1",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            borderRadius: "10px",
          }}
        >
          Login
        </button>

      </div>

    </div>
  );
}