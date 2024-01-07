import React, { useState } from "react";

const Register = ({ tgHasAcc }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [admin, setAdmin] = useState(false);
  return (
    <div className="signIn-option" id="register-option">
      <form>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          placeholder="Name"
          id="name"
          onChange={(e) => setName(e.target.value)}
          value={name}
          name="name"
          required
        />
        <label htmlFor="lastName">Lastname</label>
        <input
          type="text"
          placeholder="Lastname"
          id="lastName"
          onChange={(e) => setLastName(e.target.value)}
          value={lastName}
          name="lastName"
          required
        />
        <label htmlFor="username">Username</label>
        <input
          type="text"
          placeholder="Username"
          id="username"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          name="username"
          required
        />
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
        <label htmlFor="admin">Admin</label>
        <input
          type="checkbox"
          id="admin"
          onChange={() => {
            setAdmin((current) => !current);
          }}
          name="admin"
        />
      </form>
      <button
        type="submit"
        onClick={(e) => {
          e.preventDefault();
          (async () => {
            await fetch("http://localhost:3000/api/v1/auth/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: email,
                password: password,
                name: name,
                lastName: lastName,
                username: username,
                admin: admin,
              }),
            })
              .then((data) => data.json())
              .then((data) => {
                if (data.success === true) {
                  window.location.reload(false);
                  console.log(data);
                }
              })
              .catch((err) => console.log(err));
          })();
        }}
      >
        Register
      </button>
      <a onClick={() => tgHasAcc()}>I already have an account</a>
    </div>
  );
};

export default Register;
