import React, { useState } from "react";

const Login = ({ toggleHasAccount }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="container">
      <div id="login-container" className="sign-option">
        <form>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            placeholder="email"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="password"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button
            className="submit-btn"
            onClick={(e) => {
              e.preventDefault();
              fetch("http://localhost:3000/api/v1/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email, password: password }),
              });
            }}
          >
            Login
          </button>
        </form>
        <a className="accountStat" onClick={toggleHasAccount}>
          I don't have an account
        </a>
      </div>
    </div>
  );
};

export default Login;
