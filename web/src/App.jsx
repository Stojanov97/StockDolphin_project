import { useEffect, useState } from "react";
import "./Styles/App.css";
import SignInPage from "./Pages/SignInPage";
import MainLayout from "./Pages/MainLayout";
import Dashboard from "./Components/Dashboard";
import { ThemeSwitcherProvider } from "react-css-theme-switcher";
import { useSelector } from "react-redux";

const themes = {
  light: "./light.css",
  dark: "./dark.css",
};

function App() {
  const [logged, setLogged] = useState(false);
  const [token, setToken] = useState(false);
  console.log(useSelector((state) => state));
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
    <ThemeSwitcherProvider
      defaultTheme={useSelector((state) => (state.value ? "light" : "dark"))}
      themeMap={themes}
    >
      <div className="App">
        {logged ? (
          <MainLayout>
            <Dashboard token={token} />
          </MainLayout>
        ) : (
          <SignInPage />
        )}
      </div>
    </ThemeSwitcherProvider>
  );
}

export default App;
