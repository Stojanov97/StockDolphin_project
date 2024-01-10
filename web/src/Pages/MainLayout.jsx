import React, { useEffect } from "react";
import logo from "../Images/ITL-logo.png";
import dashboard from "../Images/Dashboard.png";
import inventory from "../Images/Inventory.png";
import reports from "../Images/Reports.png";
import signOut from "../Images/LogOut.png";
import "./styles/mainLayout.css";
import { MoonIcon } from "@heroicons/react/24/solid";
import { useDispatch, useSelector } from "react-redux";
import { useThemeSwitcher } from "react-css-theme-switcher";
import { toggle } from "../Slices/ThemeSlice";

const MainLayout = ({ children }) => {
  const dispatch = useDispatch();
  const selectedTheme = useSelector((state) => state.value);

  const { switcher, themes } = useThemeSwitcher();
  useEffect(() => {
    switcher({ theme: selectedTheme ? themes.light : themes.dark });
  }, [selectedTheme]);
  console.log(selectedTheme);
  return (
    <main>
      <nav>
        <div className="links">
          <img src={logo} alt="ITL logo" className="logo btn" />
          <button className="nav-btn">
            <img src={dashboard} alt="" />
            Dashboard
          </button>
          <button className="nav-btn">
            <img src={inventory} alt="" />
            Inventory
          </button>
          <button className="nav-btn">
            <img src={reports} className="test" alt="" />
            Reports
          </button>
          <button className="nav-btn" id="supplier-btn">
            Suppliers
          </button>
          <button
            className="nav-btn"
            onClick={() => {
              dispatch(toggle());
            }}
          >
            <MoonIcon className="nav-btn-icon" /> Theme
          </button>
        </div>
        <button
          className="nav-btn"
          onClick={async () => {
            await fetch("http://localhost:3000/api/v1/auth", {
              method: "DELETE",
            });
            window.location.reload(false);
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
