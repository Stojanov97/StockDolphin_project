import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <form>
      <label htmlFor="email">Email</label>
      <input
        type="email"
        placeholder="Email"
        id="email"
        onChange={(e) => setEmail(e.target.value)}
        name="email"
        required
      />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        placeholder="Password"
        id="password"
        onChange={(e) => setPassword(e.target.value)}
        name="password"
        required
      />
      <button
        type="submit"
        onClick={(e) => {
          e.preventDefault();
          (async () => {
            await fetch("http://localhost:3000/api/v1/auth/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: email, password: password }),
            })
              .then((data) => data.json())
              .then((data) => console.log(data))
              .catch((err) => console.log(err));
            window.location.reload(false);
          })();
        }}
      >
        Login
      </button>
    </form>
  );
};

export default Login;
