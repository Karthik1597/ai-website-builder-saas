import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function PaymentSuccess() {
  const router = useRouter();
  const [status, setStatus] = useState("saving");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!router.isReady) return;

    const savedData = localStorage.getItem("checkoutData");

    if (!savedData) {
      setStatus("error");
      return;
    }

    const paymentData = JSON.parse(savedData);
    setUserData(paymentData);

    fetch("http://localhost:5000/save-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    })
      .then((res) => res.json())
      .then(() => {
        setStatus("success");
        localStorage.removeItem("checkoutData");
      })
      .catch(() => setStatus("error"));
  }, [router.isReady]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {status === "saving" && (
          <>
            <h1 style={styles.loading}>⏳ Processing Payment...</h1>
            <p style={styles.text}>
              Please wait while we activate your plan.
            </p>
          </>
        )}

        {status === "success" && userData && (
          <>
            <h1 style={styles.success}>🎉 Payment Successful</h1>
            <p style={styles.text}>
              Welcome <b>{userData.name}</b>, your plan is now active.
            </p>

            <div style={styles.box}>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Plan:</strong> {userData.plan}</p>
              <p><strong>Status:</strong> Active</p>
            </div>

            <button
              style={styles.button}
              onClick={() => router.push("/projects")}
            >
              Go to Dashboard →
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <h1 style={styles.error}>❌ Payment Error</h1>
            <p style={styles.text}>
              Something went wrong. Please try again.
            </p>

            <button
              style={styles.button}
              onClick={() => router.push("/")}
            >
              Back to Home
            </button>
          </>
        )}

      </div>
    </div>
  );
}

/* 🎨 DARK SAAS STYLE */
const styles = {
  container: {
    height: "100vh",
    background: "#0d0d0d", // 🔥 FULL BLACK BACKGROUND
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    background: "#1a1a1a", // dark card
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
    textAlign: "center",
    width: "400px",
    color: "#fff",
  },
  loading: {
    fontSize: "24px",
    color: "#facc15",
  },
  success: {
    fontSize: "26px",
    color: "#22c55e",
  },
  error: {
    fontSize: "26px",
    color: "#ef4444",
  },
  text: {
    color: "#ccc",
    margin: "15px 0",
  },
  box: {
    background: "#262626",
    padding: "15px",
    borderRadius: "8px",
    margin: "20px 0",
    textAlign: "left",
    fontSize: "14px",
  },
  button: {
    marginTop: "10px",
    padding: "12px",
    width: "100%",
    background: "#6366f1", // modern purple
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
};