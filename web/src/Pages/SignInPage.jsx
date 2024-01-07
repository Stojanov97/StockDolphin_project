import React, { useState } from "react";
import Register from "../Components/Register";
import Login from "../Components/Login";

const SignInPage = () => {
  const [hasAcc, setHasAcc] = useState(true);
  const tgHasAcc = () => {
    setHasAcc((current) => !current);
  };
  return (
    <>
      {hasAcc ? (
        <Login tgHasAcc={tgHasAcc} />
      ) : (
        <Register tgHasAcc={tgHasAcc} />
      )}
    </>
  );
};

export default SignInPage;
