import React, { useEffect } from "react";
import logo from "../../Images/ITL-logo.png";
import dashboard from "../../Images/Dashboard.png";
import inventory from "../../Images/Inventory.png";
import reports from "../../Images/Reports.png";
import signOut from "../../Images/LogOut.png";
import "./mainLayout.css";
import themeIcon from "../../Images/Theme.png";
import { useDispatch, useSelector } from "react-redux";
import { useThemeSwitcher } from "react-css-theme-switcher";
import { toggle } from "../../Slices/ThemeSlice";
import { check } from "../../Slices/CheckTokenSlice";
import { checkDB } from "../../Slices/CheckForDBUpdatesSlice";
import { useNavigate } from "react-router-dom";

const MainLayout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedTheme = useSelector((state) => state.theme.value);

  const { switcher, themes } = useThemeSwitcher();
  useEffect(() => {
    switcher({ theme: selectedTheme ? themes.light : themes.dark });
  }, [selectedTheme]);
  return (
    <main>
      <nav>
        <div className="links">
          <img
            src={logo}
            alt="ITL logo"
            className="logo btn"
            onClick={() => {
              dispatch(check());
              dispatch(checkDB());
              navigate("/");
            }}
          />
          <button
            className="nav-btn"
            onClick={() => {
              dispatch(check());
              dispatch(checkDB());
              navigate("/");
            }}
          >
            <img src={dashboard} alt="" />
            Dashboard
          </button>
          <button
            className="nav-btn"
            onClick={() => {
              dispatch(check());
              dispatch(checkDB());
              navigate("/inventory");
            }}
          >
            <img src={inventory} alt="" />
            Inventory
          </button>
          <button
            className="nav-btn"
            onClick={() => {
              dispatch(check());
              dispatch(checkDB());
              navigate("/reports");
            }}
          >
            <img src={reports} alt="" />
            Reports
          </button>
          <button
            className="nav-btn"
            id="supplier-btn"
            onClick={() => {
              dispatch(check());
              dispatch(checkDB());
              navigate("/suppliers");
            }}
          >
            Suppliers
          </button>
          <button
            className="nav-btn"
            onClick={() => {
              dispatch(toggle());
            }}
          >
            <img src={themeIcon} className="nav-btn-icon" />{" "}
            {selectedTheme ? "Dark Mode" : "Light Mode"}
          </button>
        </div>
        <button
          className="nav-btn"
          onClick={async () => {
            await fetch("http://localhost:3000/api/v1/auth", {
              method: "DELETE",
            });
            dispatch(check());
            navigate("/");
          }}
        >
          <img src={signOut} alt="" />
          Sign Out
        </button>
      </nav>
      {children}
    </main>
  );
};

export default MainLayout;