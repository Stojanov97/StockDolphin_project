import React from "react";
import "./DashboardSummaryTile.css";

const DashboardSummaryTile = ({ img, color, amount, title }) => {
  return (
    <div className="summary-tile">
      <div className="icon-bg" style={{ backgroundColor: color }}>
        <img src={img} alt="" loading="lazy" />
      </div>
      <p className="amount">{amount}</p>
      <h2 className="tile-title">{title}</h2>
    </div>
  );
};

export default DashboardSummaryTile;
