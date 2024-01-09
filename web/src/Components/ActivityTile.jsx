import React from "react";
import "./styles/ActivityTile.css";

const ActivityTile = ({ by, action, item, cat }) => {
  return (
    <div className="activity-tile">
      <p className={action === "deleted" ? "faded" : "classic"}>
        {by} has {action} item <b>{item}</b> in{" "}
        <b>
          {" "}
          {cat} ({cat.split(" ")[0]} Category)
        </b>
      </p>
    </div>
  );
};

export default ActivityTile;
