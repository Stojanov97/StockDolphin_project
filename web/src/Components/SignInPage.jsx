import React, { useState } from "react";
import Register from "./Register";
import Login from "./Login";

const SignInPage = () => {
  const [hasAcc, setHasAcc] = useState(true);
  return <>{hasAcc ? <Login /> : <Register />}</>;
};

export default SignInPage;
