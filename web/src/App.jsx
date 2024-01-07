import { useEffect, useState } from "react";
import "./Styles/App.css";
import SignInPage from "./Pages/SignInPage";
import MainLayout from "./Components/MainLayout";
import Dashboard from "./Components/Dashboard";

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
      {logged ? (
        <MainLayout>
          <Dashboard />
        </MainLayout>
      ) : (
        <SignInPage />
      )}
      {/* <br />
      <br />
      <br />
      <p>{logged.toString()}</p>
      <p>token: {token.toString()}</p> */}
    </div>
  );
}

export default App;
