import { useEffect, useState } from "react";
import "./Styles/App.css";
import SignInPage from "./Pages/SignInPage";
import MainLayout from "./Pages/MainLayout";
import Dashboard from "./Components/Dashboard";
import { ThemeSwitcherProvider } from "react-css-theme-switcher";
import { useSelector } from "react-redux";
import { Route, Router, Routes, useNavigate } from "react-router-dom";
import PasswordReset from "./Pages/PasswordReset";
import Inventory from "./Components/Inventory";

const themes = {
  light: "../light.css",
  dark: "../dark.css",
};

function App() {
  const navigate = useNavigate();
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
            setToken(false);
            setLogged(false);
            navigate("/");
          }
        })
        .catch((err) => console.log(err));
    })();
  }, [useSelector((state) => state.token.value)]);

  return (
    <ThemeSwitcherProvider
      defaultTheme={useSelector((state) =>
        state.theme.value ? "light" : "dark"
      )}
      themeMap={themes}
    >
      <div className="App">
        {logged ? (
          <MainLayout>
            <Routes>
              <Route path="/" element={<Dashboard token={token} />} />
              <Route path="/inventory" element={<Inventory token={token} />} />
            </Routes>
          </MainLayout>
        ) : (
          <Routes>
            <Route path="/" element={<SignInPage />} />
            <Route path="/resetPassword" element={<PasswordReset />} />
          </Routes>
        )}
      </div>
    </ThemeSwitcherProvider>
  );
}

export default App;
