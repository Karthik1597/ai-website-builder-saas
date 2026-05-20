import { useState } from "react";

export default function AdminLogin() {

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleLogin = async () => {

    try {

      setLoading(true);

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

      console.error(
        "❌ LOGIN ERROR:",
        err
      );

      alert(
        "Server error. Check backend deployment."
      );

    } finally {

      setLoading(false);
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
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.5)",
        }}
      >

        <h1
          style={{
            color: "#fff",
            marginBottom: "20px",
            textAlign: "center",
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
            borderRadius: "10px",
            border: "none",
            outline: "none",
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
            borderRadius: "10px",
            border: "none",
            outline: "none",
          }}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            background: loading
              ? "#475569"
              : "#6366f1",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            borderRadius: "10px",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          {
            loading
              ? "Logging in..."
              : "Login"
          }
        </button>

      </div>

    </div>
  );
}