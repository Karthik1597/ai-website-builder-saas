"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {

  const [showModal, setShowModal] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const [loggedIn, setLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({});
    setServerError("");
    setSuccessMessage("");
  };

  const validate = () => {

    let newErrors = {};

    if (isSignup && !form.username.trim()) {
      newErrors.username = "Username required";
    }

    if (!form.email.includes("@")) {
      newErrors.email = "Invalid email";
    }

    if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (isSignup && form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    setServerError("");
    setSuccessMessage("");

    if (!validate()) return;

    try {

     const endpoint = isSignup
  ? `${process.env.NEXT_PUBLIC_API_URL}/signup`
  : `${process.env.NEXT_PUBLIC_API_URL}/login`;
  
      const res = await fetch(endpoint,{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.message);
        return;
      }

      if (isSignup) {

        setSuccessMessage("Account created successfully");

        setTimeout(()=>{
          setIsSignup(false);
          setSuccessMessage("");
        },2000);

        setForm({
          username:"",
          email:"",
          password:"",
          confirmPassword:""
        });

      } else {

        setSuccessMessage("Login successful");
        setLoggedIn(true);

        setTimeout(()=>{
          setShowModal(false);
          setSuccessMessage("");
        },1000);

      }

    } catch (error) {
      setServerError("Something went wrong");
    }

  };

  const handleLogout = () => {
    setLoggedIn(false);
    setShowProfileMenu(false);
  };

  return (

    <>
      <nav className="navbar">

        <div className="navbar-logo">AI SaaS</div>

        <ul className="navbar-links">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/projects">My Projects</Link></li>
          <li><Link href="/community">Community</Link></li>
          <li><Link href="/pricing">Pricing</Link></li>
        </ul>

        {/* Right side */}

        {loggedIn ? (

          <div style={{position:"relative"}}>

            <img
              src="https://i.pravatar.cc/40"
              alt="profile"
              style={{
                width:"36px",
                height:"36px",
                borderRadius:"50%",
                cursor:"pointer",
                border:"2px solid #22c55e"
              }}
              onClick={()=>setShowProfileMenu(!showProfileMenu)}
            />

            {showProfileMenu && (

              <div style={dropdownStyle}>

                <div
                  style={dropdownItem}
                  onClick={handleLogout}
                >
                  Logout
                </div>

              </div>

            )}

          </div>

        ) : (

          <button
            className="navbar-btn"
            onClick={()=>{
              setShowModal(true);
              setIsSignup(false);
            }}
          >
            Get Started Free
          </button>

        )}

      </nav>

      {showModal && (

        <div style={overlayStyle}>

          <div style={modalStyle}>

            <h2>{isSignup ? "Create Account" : "Login"}</h2>

            <form onSubmit={handleSubmit}>

              {isSignup && (
                <>
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    style={inputStyle}
                  />

                  {errors.username && (
                    <p style={errorStyle}>{errors.username}</p>
                  )}
                </>
              )}

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                style={inputStyle}
              />

              {errors.email && (
                <p style={errorStyle}>{errors.email}</p>
              )}

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                style={inputStyle}
              />

              {errors.password && (
                <p style={errorStyle}>{errors.password}</p>
              )}

              {isSignup && (
                <>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    style={inputStyle}
                  />

                  {errors.confirmPassword && (
                    <p style={errorStyle}>{errors.confirmPassword}</p>
                  )}
                </>
              )}

              {serverError && (
                <p style={errorStyle}>{serverError}</p>
              )}

              {successMessage && (
                <p style={{color:"#22c55e",fontSize:"13px"}}>
                  {successMessage}
                </p>
              )}

              <button type="submit" style={submitStyle}>
                {isSignup ? "Signup" : "Login"}
              </button>

            </form>

            <p style={{ marginTop: "10px" }}>

              {isSignup
                ? "Already have an account?"
                : "Don't have an account?"}{" "}

              <span
                style={{ color: "#22c55e", cursor: "pointer" }}
                onClick={()=>{
                  setIsSignup(!isSignup);
                  setErrors({});
                  setServerError("");
                  setSuccessMessage("");
                }}
              >
                {isSignup ? "Login" : "Signup"}
              </span>

            </p>

            <button
              onClick={()=>setShowModal(false)}
              style={{
                marginTop:"10px",
                background:"none",
                border:"none",
                color:"#aaa",
                cursor:"pointer"
              }}
            >
              Close
            </button>

          </div>

        </div>

      )}

    </>
  );
}

/* Dropdown */

const dropdownStyle={
  position:"absolute",
  top:"45px",
  right:"0",
  background:"#1f1f1f",
  border:"1px solid #333",
  borderRadius:"6px",
  width:"120px",
};

const dropdownItem={
  padding:"10px",
  cursor:"pointer",
  borderBottom:"1px solid #333"
};

/* Popup */

const overlayStyle={
  position:"fixed",
  top:0,
  left:0,
  width:"100%",
  height:"100%",
  background:"rgba(0,0,0,0.6)",
  display:"flex",
  justifyContent:"center",
  alignItems:"center",
  zIndex:1000,
};

const modalStyle={
  background:"#111",
  padding:"30px",
  borderRadius:"10px",
  width:"350px",
  textAlign:"center",
};

const inputStyle={
  width:"100%",
  padding:"10px",
  marginBottom:"5px",
  borderRadius:"6px",
  border:"1px solid #333",
  background:"#1f1f1f",
  color:"white",
};

const submitStyle={
  width:"100%",
  padding:"10px",
  borderRadius:"6px",
  border:"none",
  background:"#22c55e",
  color:"white",
  cursor:"pointer",
};

const errorStyle={
  color:"red",
  fontSize:"12px",
  textAlign:"left",
  marginBottom:"8px",
};