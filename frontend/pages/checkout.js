import { useRouter } from "next/router";
import { useState } from "react";

export default function Checkout() {

  const router = useRouter();
  const { plan, price } = router.query;

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const payNow = async () => {

    if (!user.name || !user.email) {
      alert("Fill required fields");
      return;
    }

    try {
      // ✅ VERY IMPORTANT (FIX YOUR ISSUE)
      localStorage.setItem("checkoutData", JSON.stringify({
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        plan
      }));

      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...user,
          plan,
          price
        })
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Payment failed. Try again.");
      }

    } catch (err) {
      console.error("❌ Checkout error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>

      <h1>Checkout - {plan} Plan</h1>

      <div style={{ maxWidth: "400px", margin: "auto" }}>

        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          style={input}
        />

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          style={input}
        />

        <input
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          style={input}
        />

        <input
          name="address"
          placeholder="Address"
          onChange={handleChange}
          style={input}
        />

        <button onClick={payNow} style={btn}>
          Pay RM {price}
        </button>

      </div>

    </div>
  );
}

const input = {
  width: "100%",
  padding: "10px",
  margin: "10px 0"
};

const btn = {
  padding: "10px",
  width: "100%",
  background: "black",
  color: "white",
  border: "none",
  cursor: "pointer"
};