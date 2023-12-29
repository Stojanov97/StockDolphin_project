import { useEffect, useState } from "react";
import "./App.css";
import SignInOptions from "./Components/SignInOptions";
import LoggedScreen from "./Components/LogedScreen";
import { useSelector, useDispatch } from "react-redux";
import { loginToken, deleteToken } from "./slices/token";
import { token } from "./slices/token";

function App() {
  const dispatch = useDispatch();
  let Token = useSelector(token);
  console.log(Token);
  useEffect(async () => {
    console.log("use effect started");
    let rawCookies = await document.cookie;
    let cookies = await rawCookies.split("; ");
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = await cookie.split("=");
      if (cookieName === "token") {
        await dispatch(loginToken(cookieValue));
      }
    }
    if (Token == false) {
      let responseFromRefreshToken = await fetch(
        "http://localhost:3000/api/v1/auth/refreshToken",
        {
          method: "POST",
        }
      );
      let responseToken = await responseFromRefreshToken.json();
      if (responseToken.success === true) {
        await dispatch(loginToken(responseToken.token));
      } else {
        await dispatch(deleteToken());
      }
    }
  }, []);

  return (
    <div className="App">{Token ? <LoggedScreen /> : <SignInOptions />}</div>
  );
}

export default App;
