import { useState } from "react";

export default function Signup() {

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword,
    setConfirmPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const handleSignup =
    async () => {

      try {

        setMessage("");

        if (
          !name ||
          !email ||
          !password ||
          !confirmPassword
        ) {

          setMessage(
            "Please fill all fields"
          );

          return;
        }

        if (
          password !==
          confirmPassword
        ) {

          setMessage(
            "Passwords do not match"
          );

          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/signup`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              name,
              email,
              password,
            }),
          }
        );

        const data =
          await res.json();

        console.log(data);

        if (data.success) {

          setMessage(
            "✅ Account created successfully"
          );

          setTimeout(() => {

            window.location.href =
              "/login";

          }, 1500);

        } else {

          setMessage(
            data.message ||
            data.error ||
            "Signup failed"
          );
        }

      } catch (err) {

        console.error(err);

        setMessage(
          "Something went wrong"
        );
      }
    };

  return (

    <div
      style={{
        minHeight: "100vh",
        background:
          "#0f172a",
        display: "flex",
        justifyContent:
          "center",
        alignItems:
          "center",
      }}
    >

      <div
        style={{
          width: "400px",
          padding: "40px",
          background:
            "#111827",
          borderRadius:
            "20px",
        }}
      >

        <h1
          style={{
            color: "#fff",
            marginBottom:
              "20px",
          }}
        >
          Create Account
        </h1>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: "14px",
            marginBottom:
              "20px",
          }}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: "14px",
            marginBottom:
              "20px",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: "14px",
            marginBottom:
              "20px",
          }}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: "14px",
            marginBottom:
              "20px",
          }}
        />

        {

          message && (

            <p
              style={{
                color:
                  message.includes("✅")
                    ? "#22c55e"
                    : "#ef4444",

                marginBottom:
                  "20px",
              }}
            >
              {message}
            </p>
          )
        }

        <button
          onClick={handleSignup}
          style={{
            width: "100%",
            padding: "14px",
            background:
              "#6366f1",
            color: "#fff",
            border: "none",
            cursor:
              "pointer",
            borderRadius:
              "10px",
          }}
        >
          Signup
        </button>

      </div>

    </div>
  );
}