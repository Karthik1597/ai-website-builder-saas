import { useState } from "react";

export default function SignupModal({ closeModal, openLogin }) {

  const [username,setUsername] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [message,setMessage] = useState("");

  const handleSignup = async () => {

    setMessage("");

    const res = await fetch("/api/signup",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ username,email,password })
    });

    const data = await res.json();

    setMessage(data.message);

    if(res.ok){

      setTimeout(()=>{
        openLogin();
      },2000);

    }

  };

  return(

<div className="auth-overlay">

<div className="auth-card">

<h2>Create Account</h2>

<input
placeholder="Username"
value={username}
onChange={(e)=>setUsername(e.target.value)}
/>

<input
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

{message && (
<p className="message">
{message === "Signup successful"
? "Account created successfully"
: message}
</p>
)}

<button onClick={handleSignup}>
Signup
</button>

<p>
Already have an account?
<span onClick={openLogin}> Login</span>
</p>

<button className="close-btn" onClick={closeModal}>
Close
</button>

</div>

</div>

  );
}