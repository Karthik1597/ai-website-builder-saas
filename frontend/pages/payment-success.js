import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function PaymentSuccess() {

  const router = useRouter();

  const {
    session_id
  } = router.query;

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {

    if (!session_id) return;

    const verifyPayment =
      async () => {

        try {

          const res = await fetch(
            `/api/verify-payment?session_id=${session_id}`
          );

          const data =
            await res.json();

          console.log(
            "PAYMENT VERIFY:",
            data
          );

          if (
            data &&
            data.payment_status === "paid"
          ) {

            setLoading(false);

          } else {

            setError(
              "Payment verification failed"
            );
          }

        } catch (err) {

          console.error(err);

          setError(
            "Something went wrong. Please try again."
          );
        }
      };

    verifyPayment();

  }, [session_id]);

  if (loading && !error) {

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

  if (error) {

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
            color: "#ef4444",
            marginBottom: "20px"
          }}
        >
          ❌ Payment Error
        </h1>

        <p
          style={{
            marginBottom: "30px"
          }}
        >
          {error}
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