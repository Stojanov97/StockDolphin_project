import React, { useState } from "react";

const Register = ({ toggleHasAccount }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [admin, setAdmin] = useState(false);
  const [err, setErr] = useState(null);
  return (
    <div className="container">
      <div id="register-container" className="sign-option">
        <form>
          <div className="form-divide">
            <label htmlFor="name">Name</label>
            <input
              required
              type="text"
              name="name"
              placeholder="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label htmlFor="lastname">Lastname</label>
            <input
              required
              type="text"
              name="lastname"
              placeholder="lastname"
              id="lastnam"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
            <label htmlFor="username">Username</label>
            <input
              required
              type="text"
              name="username"
              placeholder="username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-divide">
            <label htmlFor="email">Email</label>
            <input
              required
              type="email"
              name="email"
              placeholder="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password">Password</label>
            <input
              required
              type="password"
              name="password"
              placeholder="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="admin">Admin</label>
            <input
              type="checkbox"
              name="admin"
              placeholder="admin"
              id="admin"
              value={admin}
              onClick={() => setAdmin((current) => !current)}
            />
          </div>
        </form>
        <p className="missing-err">{err && err}</p>
        <button
          className="submit-btn"
          onClick={async (e) => {
            try {
              let rawStatus = await fetch(
                "http://localhost:3000/api/v1/auth/register",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    email: email,
                    password: password,
                    name: name,
                    lastName: lastname,
                    username: username,
                    admin: admin,
                  }),
                }
              );
              let status = await rawStatus.json();
              console.log(status.err);
              if (status.success === false) {
                setErr(status.err);
              } else if (status.success === true) {
                setErr(false);
              }
            } catch (err) {
              console.log("Err", err);
              setErr(err);
            }
          }}
        >
          Register
        </button>
        <a className="accountStat" onClick={toggleHasAccount}>
          I have an account
        </a>
      </div>
    </div>
  );
};

export default Register;
