import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ThemeSwitcherProvider } from "react-css-theme-switcher";
import { setTokenPayload } from "./Slices/DecodedTokenSlice";
import { sliceCategories } from "./Slices/CategoriesSlice";
import { sliceItems } from "./Slices/ItemsSlice";
import { sliceOrders } from "./Slices/OrdersSlice";
import { sliceSuppliers } from "./Slices/SuppliersSlice";
import { sliceInvoices } from "./Slices/InvoicesSlice";
import "./Styles/App.css";
import SignInPage from "./Pages/SignInOptions/SignInPage";
import PasswordReset from "./Pages/SignInOptions/PasswordReset";
import MainLayout from "./Pages/MainLayout";
import Dashboard from "./Pages/Dashboard";
import CategoryInventory from "./Pages/Inventory/Categories";
import ItemInventory from "./Pages/Inventory/Items";
import OrderInventory from "./Pages/Inventory/Orders";
import Reports from "./Pages/Reports";
import Loading from "./Components/Loading";
import ReportsActivity from "./Pages/Reports/Activity";
import ReportsSummary from "./Pages/Reports/Summary";
import Suppliers from "./Pages/Suppliers";
import { sliceLoading } from "./Slices/LoadingSlice";

const themes = { // Themes for the app
  light: `${__dirname}../light.css`,
  dark: `${__dirname}../dark.css`,
};

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logged, setLogged] = useState(false); // Logged in state
  const [token, setToken] = useState(false); // Token payload
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const loading = useSelector((state) => state.loading.value);
  useEffect(() => {
     fetch("/api/v1/auth/refreshToken", { // Refresh token fetch
        method: "POST",
      })
        .then((data) => data.json())
        .then((data) => {
          if (data.success === true) { // If token is valid set token and logged in state
            setToken(data.userData);
            setLogged(true);
          } else { // If token is invalid set token and logged in state to false
            setToken(false);
            setLogged(false);
            if (window.location.pathname !== "/resetPassword") {
              navigate("/");
            }
          }
        })
        .catch((err) => console.log(err));
  }, [useSelector((state) => state.checkToken.value)]);

  useEffect(() => { // Set token payload on token change
    if (token) {
      dispatch(setTokenPayload(token));
    }
  }, [token]);

  useEffect(() => { // Fetch data from the database, on change of logged status and checkDB value
    if (logged) {
      (async () => {
        await fetch("/api/v1/categories")
          .then((data) => data.json())
          .then((data) => setCategories(data))
          .catch((err) => console.log(err));
        await fetch("/api/v1/items")
          .then((data) => data.json())
          .then((data) => setItems(data))
          .catch((err) => console.log(err));
        await fetch("/api/v1/orders")
          .then((data) => data.json())
          .then((data) => setOrders(data))
          .catch((err) => console.log(err));
        await fetch("/api/v1/suppliers")
          .then((data) => data.json())
          .then((data) => setSuppliers(data))
          .catch((err) => console.log(err));
        await fetch("/api/v1/invoices")
          .then((data) => data.json())
          .then((data) => setInvoices(data))
          .catch((err) => console.log(err));
        dispatch(sliceLoading(false))
      })();
    }
  }, [logged, useSelector((state) => state.checkDB.value)]);

  useEffect(() => { // Slice data from DB to the redux store
    dispatch(sliceCategories(categories));
    dispatch(sliceItems(items));
    dispatch(sliceOrders(orders));
    dispatch(sliceSuppliers(suppliers));
    dispatch(sliceInvoices(invoices));
  }, [categories, items, orders, suppliers, invoices]);

  return (
    <ThemeSwitcherProvider 
      defaultTheme={useSelector((state) =>
        state.theme.value ? "light" : "dark"
      )}
      themeMap={themes}
    >{/* Theme switcher provider for the app */}
      <div className="App">
        {logged ? (// If logged in show the main layout
          <>
            {loading && <Loading />} {/*Show loading component if loading is true*/}
            <MainLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/inventory" element={<CategoryInventory />} />
                <Route path="/inventory/:id" element={<ItemInventory />} />
                <Route
                  path="/inventory/item/:id"
                  element={<OrderInventory />}
                />
                <Route path="/reports" element={<Reports />} />
                <Route path="/reports/activity" element={<ReportsActivity />} />
                <Route path="/reports/summary" element={<ReportsSummary />} />
                <Route path="/suppliers" element={<Suppliers />} />
              </Routes>
            </MainLayout>
          </>
        ) : ( // If not logged in show the sign in page
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
