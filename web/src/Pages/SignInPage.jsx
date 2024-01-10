import React, { useState } from "react";
import Register from "../Components/Register";
import Login from "../Components/Login";
import "./styles/signInPage.css";

const SignInPage = () => {
  const [hasAcc, setHasAcc] = useState(true);
  const tgHasAcc = () => {
    setHasAcc((current) => !current);
  };
  return (
    <div className="container-signIn-options">
      {hasAcc ? (
        <Login tgHasAcc={tgHasAcc} />
      ) : (
        <Register tgHasAcc={tgHasAcc} />
      )}
    </div>
  );
};

export default SignInPage;
