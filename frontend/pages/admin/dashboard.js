import Link from "next/link";

export default function Dashboard() {

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
          fontSize: "40px",
          marginBottom: "10px",
        }}
      >
        Admin Dashboard
      </h1>

      <p
        style={{
          color: "#94a3b8",
          marginBottom: "40px",
        }}
      >
        Manage users and payments
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(300px,1fr))",
          gap: "25px",
        }}
      >

        <Link href="/admin/users">
          <div
            style={{
              padding: "40px",
              borderRadius: "24px",
              background: "#111827",
              cursor: "pointer",
              border:
                "1px solid rgba(255,255,255,0.08)",
              transition: "0.3s",
            }}
          >
            <h2
              style={{
                fontSize: "28px",
                marginBottom: "10px",
              }}
            >
              👥 Users
            </h2>

            <p
              style={{
                color: "#94a3b8",
              }}
            >
              View and manage all users
            </p>
          </div>
        </Link>

        <Link href="/admin/payments">
          <div
            style={{
              padding: "40px",
              borderRadius: "24px",
              background: "#111827",
              cursor: "pointer",
              border:
                "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <h2
              style={{
                fontSize: "28px",
                marginBottom: "10px",
              }}
            >
              💳 Payments
            </h2>

            <p
              style={{
                color: "#94a3b8",
              }}
            >
              View and manage payments
            </p>
          </div>
        </Link>

      </div>

    </div>
  );
}