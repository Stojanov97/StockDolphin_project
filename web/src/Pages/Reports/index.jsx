import React from "react";
import { useNavigate } from "react-router-dom";
import "./Reports.css";
import ActivityIcon from "../../Images/Activity.png";
import InventoryIcon from "../../Images/Inventory.png";
import { useDispatch } from "react-redux";
import { checkDB } from "../../Slices/CheckForDBUpdatesSlice";
import { sliceLoading } from "../../Slices/LoadingSlice";

const Reports = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  return (
    <section>
      <div className="breadcrumb">
        <h1
          onClick={() => {
            dispatch(sliceLoading(true))
            dispatch(checkDB());
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
            dispatch(sliceLoading(true))
            dispatch(checkDB());
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
            dispatch(sliceLoading(true))
            dispatch(checkDB());
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
