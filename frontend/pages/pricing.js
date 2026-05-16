import { useRouter } from "next/router";

export default function Pricing() {

  const router = useRouter();

  const plans = [
    { name: "Basic", price: 10, features: ["1 Project", "Basic AI", "Email Support"] },
    { name: "Pro", price: 25, features: ["5 Projects", "Advanced AI", "Priority Support"] },
    { name: "Enterprise", price: 50, features: ["Unlimited Projects", "Full AI Access", "24/7 Support"] }
  ];

  const goToCheckout = (plan) => {
    router.push({
      pathname: "/checkout",
      query: {
        plan: plan.name,
        price: plan.price
      }
    });
  };

  return (
    <div style={{
      minHeight: "100vh",
      padding: "40px",
      background: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
      color: "white"
    }}>

      <h1 style={{
        textAlign: "center",
        fontSize: "36px",
        marginBottom: "40px"
      }}>
        Choose Your Plan
      </h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
        gap: "25px"
      }}>

        {plans.map((p, i) => (
          <div key={i} style={cardStyle}>

            <h2>{p.name}</h2>

            <h1 style={{ margin: "10px 0" }}>${p.price}</h1>

            {p.features.map((f, index) => (
              <p key={index} style={{ opacity: 0.8 }}>✔ {f}</p>
            ))}

            <button onClick={() => goToCheckout(p)} style={btn}>
              Continue
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}

const cardStyle = {
  padding: "25px",
  borderRadius: "15px",
  background: "rgba(255,255,255,0.08)",
  textAlign: "center",
  backdropFilter: "blur(10px)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
  transition: "0.3s"
};

const btn = {
  marginTop: "15px",
  padding: "10px",
  border: "none",
  borderRadius: "6px",
  background: "linear-gradient(45deg,#00c6ff,#0072ff)",
  color: "white",
  cursor: "pointer"
};