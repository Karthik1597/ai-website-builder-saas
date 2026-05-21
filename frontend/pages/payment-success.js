import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function PaymentSuccess() {

  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const timer = setTimeout(() => {

      setLoading(false);

    }, 2500);

    return () => clearTimeout(timer);

  }, []);

  if (loading) {

    return (

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#0f172a",
          color: "#fff",
          fontSize: "24px"
        }}
      >
        Processing Payment...
      </div>
    );
  }

  return (

    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f172a",
        color: "#fff",
        padding: "30px",
        textAlign: "center"
      }}
    >

      <h1
        style={{
          color: "#22c55e",
          fontSize: "42px",
          marginBottom: "20px"
        }}
      >
        ✅ Payment Successful
      </h1>

      <p
        style={{
          color: "#cbd5e1",
          marginBottom: "30px"
        }}
      >
        Thank you for purchasing.
      </p>

      <button
        onClick={() =>
          window.location.href = "/"
        }

        style={{
          padding: "14px 30px",
          border: "none",
          borderRadius: "12px",
          background: "#6366f1",
          color: "#fff",
          cursor: "pointer"
        }}
      >
        Back to Home
      </button>

    </div>
  );
}