import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PasswordReset = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const id = queryParams.get("id");
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState(false);
  const [timer, setTimer] = useState(0);
  const [success, setSuccess] = useState(false);
  const [showPass, setShowPass] = useState(false);

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
    <div className="container-signIn-options">
      <div className="sign-option">
        <form>
          {success ? (
            <h3 className="centered-text">
              You will be redirected to the login screen in: {timer}s
            </h3>
          ) : (
            <>
              <label htmlFor="pass">New Password</label>
              <input
                required
                type={showPass ? "text" : "password"}
                name="pass"
                placeholder="new password"
                id="pass"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <label htmlFor="passCon">Confirm Password</label>
              <input
                required
                type={showPass ? "text" : "password"}
                name="passCon"
                placeholder="confirm new password"
                id="passCon"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
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
            </>
          )}

          <button
            className="submit-btn"
            onClick={(e) => {
              e.preventDefault();
              (async () => {
                await fetch(`/api/v1/auth/${id}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    newPassword: password,
                    confirmNewPassword: confirmPassword,
                  }),
                })
                  .then((data) => data.json())
                  .then((data) => {
                    if (data.success === true) {
                      setSuccess(true);
                      setErr(false);
                      setTimer(7);
                      setTimeout(() => {
                        navigate("/");
                      }, 7000);
                    } else if (data.success === false) {
                      setErr(data.err);
                    }
                  })
                  .catch((err) => console.log(err));
              })();
            }}
          >
            {success ? "Password Changed" : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;
