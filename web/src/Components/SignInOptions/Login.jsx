import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toggle } from "../../Slices/ForgotPasswordSlice";
import { check } from "../../Slices/CheckTokenSlice";

const Login = ({ tgHasAcc }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(false);
  const [showPass, setShowPass] = useState(false);
  return (
    <div id="login-container" className="sign-option">
      <form>
        <label htmlFor="email">Email</label>
        <input
          required
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
          required
          type={showPass ? "text" : "password"}
          name="password"
          placeholder="password"
          id="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <div>
          <input
            type="checkbox"
            onChange={() => {
              setShowPass((curr) => !curr);
            }}
          />
          <span className="showPass">show password</span>
        </div>
        <p className="missing-err">{err && err}</p>
        <button
          className="submit-btn"
          onClick={(e) => {
            e.preventDefault();
            (async () => {
              await fetch("/api/v1/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email, password: password }),
              })
                .then((data) => data.json())
                .then((data) => {
                  if (data.success === true) {
                    setErr(false);
                    dispatch(check());
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
      <a
        className="accountStat"
        onClick={() => {
          dispatch(toggle());
        }}
      >
        Forgot Password?
      </a>
    </div>
  );
};

export default Login;
