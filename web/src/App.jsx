import { useEffect, useState } from "react";
import "./App.css";
import SignInPage from "./Components/SignInPage";

function App() {
  const [logged, setLogged] = useState(false);
  const [token, setToken] = useState(false);

  useEffect(() => {
    (async () => {
      const cookieString = document.cookie;
      const cookies = cookieString.split("; ");

      for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split("=");
        if (cookieName === "token") {
          setToken(cookieValue);
          return setLogged(true);
        }
      }
      return fetch("http://localhost:3000/api/v1/auth/refreshToken", {
        method: "POST",
      })
        .then((data) => data.json())
        .then((data) => {
          if (data.success === true) {
            setToken(data.token);
            setLogged(true);
          } else {
            console.log("got in else");
            setToken(false);
            setLogged(false);
          }
        })
        .catch((err) => console.log(err));
    })();
  }, []);

  return (
    <div className="App">
      {logged ? <p>hi</p> : <SignInPage />}
      <p>{logged.toString()}</p>
      <p>token: {token.toString()}</p>
    </div>
  );
}

export default App;
