import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import "./styles/SignInOptions.css";

const SignInOptions = () => {
  const [hasAccount, setHasAccount] = useState(true);
  const toggleHasAccount = async () => {
    setHasAccount((current) => !current);
  };
  return (
    <div className="container-signIn-options">
      {hasAccount ? (
        <Login toggleHasAccount={toggleHasAccount} />
      ) : (
        <Register toggleHasAccount={toggleHasAccount} />
      )}
    </div>
  );
};

export default SignInOptions;
