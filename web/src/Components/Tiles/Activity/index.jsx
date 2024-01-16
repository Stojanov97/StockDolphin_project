import React from "react";
import "./ActivityTile.css";

const ActivityTile = ({ by, action, item, what, cat }) => {
  return (
    <div className="activity-tile">
      <p className={action === "deleted" ? "faded" : "classic"}>
        {by} has {action} {what === "order" ? "" : what} <b>{item}</b>{" "}
        {action === "edited" && what === "order" && "order"}{" "}
        {what === "supplier" ? (
          ""
        ) : what === "category" ? (
          ""
        ) : (
          <>
            {what === "order" ? "from" : "in"}
            <b>
              {" "}
              {cat} ({cat.split(" ")[0]} Category)
            </b>
          </>
        )}
      </p>
    </div>
  );
};

export default ActivityTile;
