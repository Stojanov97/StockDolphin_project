import React from "react";
import logo from "../Images/ITL-logo.png";
import dashboard from "../Images/Dashboard.png";
import inventory from "../Images/Inventory.png";
import reports from "../Images/Reports.png";
import signOut from "../Images/LogOut.png";
import "../Styles/mainLayout.css";

const MainLayout = (props) => {
  return (
    <main>
      <nav>
        <div className="links">
          <img src={logo} alt="ITL logo" className="logo btn" />
          <button className="nav-btn">
            <img src={dashboard} />
            Dashboard
          </button>
          <button className="nav-btn">
            <img src={inventory} />
            Inventory
          </button>
          <button className="nav-btn">
            <img src={reports} />
            Reports
          </button>
          <button className="nav-btn" id="supplier-btn">
            Suppliers
          </button>
        </div>
        <button className="nav-btn">
          <img src={signOut} />
          Sign Out
        </button>
      </nav>
      {props.children}
    </main>
  );
};

export default MainLayout;
