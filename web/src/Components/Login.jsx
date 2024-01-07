import React, { useState } from "react";

const Login = ({ tgHasAcc }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="signIn-option" id="login-option">
      <form>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          placeholder="Email"
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          name="email"
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="Password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
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
                .then((data) => {
                  if (data.success === true) {
                    window.location.reload(false);
                    console.log(data);
                  }
                })
                .catch((err) => console.log(err));
              window.location.reload(false);
            })();
          }}
        >
          Login
        </button>
      </form>
      <a onClick={() => tgHasAcc()}>I don't have an account</a>
    </div>
  );
};

export default Login;
