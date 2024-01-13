import { useDebugValue, useEffect, useState } from "react";
import "./Styles/App.css";
import SignInPage from "./Pages/SignInOptions/SignInPage";
import MainLayout from "./Pages/MainLayout";
import Dashboard from "./Components/Dashboard";
import { ThemeSwitcherProvider } from "react-css-theme-switcher";
import { useDispatch, useSelector } from "react-redux";
import { Route, Router, Routes, useNavigate } from "react-router-dom";
import PasswordReset from "./Pages/SignInOptions/PasswordReset";
import InventoryCategory from "./Components/InventoryCategory";
import { jwtDecode } from "jwt-decode";
import { setTokenPayload } from "./Slices/DecodedTokenSlice";
import { sliceCategories } from "./Slices/CategoriesSlice";
import { sliceItems } from "./Slices/ItemsSlice";
import { sliceOrders } from "./Slices/OrdersSlice";
import InventoryItem from "./Components/InventoryItem";

const themes = {
  light: "../light.css",
  dark: "../dark.css",
};

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logged, setLogged] = useState(false);
  const [token, setToken] = useState(false);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
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

  useEffect(() => {
    if (token) {
      dispatch(setTokenPayload(jwtDecode(token)));
    }
  }, [token]);

  useEffect(() => {
    console.log("checking db");
    if (logged) {
      console.log("fetching");
      (async () => {
        await fetch("http://localhost:3000/api/v1/categories")
          .then((data) => data.json())
          .then((data) => setCategories(data))
          .catch((err) => console.log(err));
        await fetch("http://localhost:3000/api/v1/items")
          .then((data) => data.json())
          .then((data) => setItems(data))
          .catch((err) => console.log(err));
        await fetch("http://localhost:3000/api/v1/orders")
          .then((data) => data.json())
          .then((data) => setOrders(data))
          .catch((err) => console.log(err));
      })();
    }
  }, [logged, useSelector((state) => state.checkDB.value)]);

  useEffect(() => {
    dispatch(sliceCategories(categories));
    dispatch(sliceItems(items));
    dispatch(sliceOrders(orders));
  }, [categories, items, orders]);

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
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventory" element={<InventoryCategory />} />
              <Route path="/inventory/:id" element={<InventoryItem />} />
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
