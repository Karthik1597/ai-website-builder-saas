import { useState } from "react";

export default function LoginModal({ closeModal, openSignup, setUser }) {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [message,setMessage] = useState("");

  const handleLogin = async () => {

    setMessage("");

    const res = await fetch("/api/login",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ email,password })
    });

    const data = await res.json();

    setMessage(data.message);

    if(res.ok){

      setUser(email);

      setTimeout(()=>{
        closeModal();
      },1000);

    }

  };

  return(

<div className="auth-overlay">

<div className="auth-card">

<h2>Login</h2>

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

{message && <p className="message">{message}</p>}

<button onClick={handleLogin}>
Login
</button>

<p>
Don't have an account?
<span onClick={openSignup}> Signup</span>
</p>

<button className="close-btn" onClick={closeModal}>
Close
</button>

</div>

</div>

  );
}