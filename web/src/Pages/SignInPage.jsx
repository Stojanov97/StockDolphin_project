import React, { useState } from "react";
import Register from "../Components/Register";
import Login from "../Components/Login";
import "./styles/signInPage.css";
import { useSelector } from "react-redux";
import ResetPasswordRequestForm from "../Components/ResetPasswordRequestForm";

const SignInPage = () => {
  const [hasAcc, setHasAcc] = useState(true);
  const forgotPassword = useSelector((state) => state.forgot.value);
  const tgHasAcc = () => {
    setHasAcc((current) => !current);
  };
  return (
    <div className="container-signIn-options">
      {forgotPassword ? (
        <ResetPasswordRequestForm />
      ) : hasAcc ? (
        <Login tgHasAcc={tgHasAcc} key={"login"} />
      ) : (
        <Register tgHasAcc={tgHasAcc} key={"register"} />
      )}
    </div>
  );
};

export default SignInPage;
