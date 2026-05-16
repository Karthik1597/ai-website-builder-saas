import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* HERO SECTION */}
      <section
        className="hero container"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <h1>
          Build AI Websites{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Instantly
          </span>
        </h1>

        <p>Create professional websites using AI in seconds.</p>

        <Link href="/ai-builder" className="primary-btn">
          Get Started Free
        </Link>
      </section>

      {/* WHY CHOOSE SECTION */}
      <section
        className="section container"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <h2>Why Choose AI Builder?</h2>
        <p>
          Save time, build faster, and launch professional sites effortlessly.
        </p>

        <div className="grid">
          <div className="card">
            <h3>⚡ Fast</h3>
            <p>Generate full websites in seconds using AI.</p>
          </div>

          <div className="card">
            <h3>🎨 Professional</h3>
            <p>Clean layouts suitable for real businesses.</p>
          </div>

          <div className="card">
            <h3>🚀 Scalable</h3>
            <p>Edit, export, and deploy anytime.</p>
          </div>
        </div>
      </section>
    </>
  );
}