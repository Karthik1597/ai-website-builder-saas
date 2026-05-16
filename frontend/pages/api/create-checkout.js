import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { plan, name, email, phone, address } = req.body;

    if (!plan || !name || !email) {
      return res.status(400).json({ error: "Missing fields" });
    }

    let price = 5000;
    if (plan === "Pro") price = 10000;
    if (plan === "Premium") price = 15000;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,

      line_items: [
        {
          price_data: {
            currency: "myr",
            product_data: { name: `${plan} Plan` },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],

      // ✅ IMPORTANT
      metadata: {
        name,
        email,
        phone: phone || "",
        address: address || "",
        plan,
      },

      // ✅ PASS SESSION ID
      success_url:
        "http://localhost:3000/payment-success?session_id={CHECKOUT_SESSION_ID}",

      cancel_url: "http://localhost:3000",
    });

    return res.status(200).json({ url: session.url });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Stripe error" });
  }
}