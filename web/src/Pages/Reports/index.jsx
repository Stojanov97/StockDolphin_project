import React from "react";
import { useNavigate } from "react-router-dom";
import "./Reports.css";
import ActivityIcon from "../../Images/Activity.png";
import InventoryIcon from "../../Images/Inventory.png";

const Reports = () => {
  const navigate = useNavigate();
  return (
    <section>
      <div className="breadcrumb">
        <h1
          onClick={() => {
            window.location.reload(false);
          }}
        >
          Reports
        </h1>
      </div>
      <hr />
      <div id="reports-workspace">
        <div
          className="report-option"
          onClick={() => {
            navigate("/reports/activity");
          }}
        >
          <div className="report-title">
            <img className="report-icon" src={ActivityIcon} alt="" />
            <h1>Activity History</h1>
          </div>
          <p>
            Activity history helps keep track of the things you do with your
            items, categories, tags, etc., such as creating, editing or deleting
          </p>
          <hr />
        </div>
        <div
          className="report-option"
          onClick={() => {
            navigate("/reports/summary");
          }}
        >
          <div className="report-title">
            <img className="report-icon" src={InventoryIcon} alt="" />
            <h1>Inventory Summary</h1>
          </div>
          <p>
            Inventory Summary provides detailed visualizations about the total
            cost of the categories over a period of time.
          </p>
          <hr />
        </div>
      </div>
    </section>
  );
};

export default Reports;
