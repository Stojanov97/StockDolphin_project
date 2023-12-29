import React, { useState } from "react";

const Login = ({ toggleHasAccount }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(false);
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
          <p className="missing-err">{err && err}</p>
          <button
            className="submit-btn"
            onClick={async (e) => {
              try {
                let rawStatus = await fetch(
                  "http://localhost:3000/api/v1/auth/login",
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      email: email,
                      password: password,
                    }),
                  }
                );
                let status = await rawStatus.json();
                console.log(status.err);
                if (status.success === false) {
                  await setErr(status.err);
                } else if (status.success === true) {
                  await setErr(false);
                }
              } catch (err) {
                console.log("Err", err);
                setErr(err);
              }
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
