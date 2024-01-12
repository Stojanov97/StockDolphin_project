import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toggle } from "../../Slices/ForgotPasswordSlice";

const ResetPasswordRequestForm = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [err, setErr] = useState(false);

  useEffect(() => {
    if (timer === 0) {
      return;
    } else {
      setTimeout(() => {
        setTimer((curr) => curr - 1);
      }, 1000);
    }
  }, [timer]);

  return (
    <div id="login-container" className="sign-option">
      <form>
        {sent ? (
          <h3 className="centered-text">
            You will be redirected to the login screen in: {timer}s
          </h3>
        ) : (
          <>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              placeholder="email"
              required
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <p className="missing-err">{err && err}</p>
          </>
        )}
        <button
          className="submit-btn"
          onClick={(e) => {
            e.preventDefault();
            (async () => {
              await fetch("http://localhost:3000/api/v1/auth/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email }),
              })
                .then((data) => data.json())
                .then((data) => {
                  if (data.success === true) {
                    setSent(true);
                    setErr(false);
                    setTimer(7);
                    setTimeout(() => {
                      window.location.reload(false);
                    }, 7000);
                  } else if (data.success === false) {
                    setErr("An error ocurred please try again");
                  }
                })
                .catch((err) => setErr("An error ocurred please try again"));
            })();
          }}
        >
          {sent ? "The link has been sent" : "Send reset link"}
        </button>
        <a
          className="accountStat"
          onClick={() => {
            dispatch(toggle());
          }}
        >
          back to Login
        </a>
      </form>
    </div>
  );
};

export default ResetPasswordRequestForm;
