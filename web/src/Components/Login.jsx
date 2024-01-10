import React, { useState } from "react";

const Login = ({ tgHasAcc }) => {
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
            onClick={(e) => {
              e.preventDefault();
              (async () => {
                await fetch("http://localhost:3000/api/v1/auth/login", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email: email, password: password }),
                })
                  .then((data) => data.json())
                  .then((data) => {
                    if (data.success === true) {
                      setErr(false);
                      window.location.reload(false);
                      console.log(data);
                    } else if (data.success === false) {
                      setErr(data.err);
                    }
                  })
                  .catch((err) => console.log(err));
              })();
            }}
          >
            Login
          </button>
        </form>
        <a className="accountStat" onClick={tgHasAcc}>
          I don't have an account
        </a>
      </div>
    </div>
  );
};

export default Login;
