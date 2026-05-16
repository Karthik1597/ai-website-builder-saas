import { useEffect, useState } from "react";

export default function PaymentsPage() {

  const [payments, setPayments] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const loadPayments = async () => {

    const res = await fetch(
      "http://localhost:5001/admin/payments"
    );

    const data = await res.json();

    setPayments(data);
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const deletePayment = async (id) => {

    const confirmDelete =
      confirm("Delete payment?");

    if (!confirmDelete) return;

    await fetch(
      `http://localhost:5001/admin/payments/${id}`,
      {
        method: "DELETE",
      }
    );

    loadPayments();
  };

  const filteredPayments =
    payments.filter((payment) =>
      payment.email
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
        💳 Payments Management
      </h1>

      <input
        placeholder="Search payment email..."

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
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Plan</th>
              <th style={thStyle}>Amount</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>

          <tbody>

            {filteredPayments.map((payment) => (

              <tr key={payment.id}>

                <td style={tdStyle}>
                  {payment.id}
                </td>

                <td style={tdStyle}>
                  {payment.email}
                </td>

                <td style={tdStyle}>
                  {payment.plan}
                </td>

                <td style={tdStyle}>
                  RM {payment.amount}
                </td>

                <td style={tdStyle}>
                  {payment.payment_status}
                </td>

                <td style={tdStyle}>

                  <button
                    onClick={() =>
                      deletePayment(payment.id)
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