import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Activity.css";
import ActivityTile from "../../../Components/Tiles/Activity";
import SortIcon from "../../../Images/Sort.png";

const ReportsActivity = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [sort, setSort] = useState(false);
  const [filter, setFilter] = useState(false);
  useEffect(() => {
    fetch("/api/v1/items/recent")
      .then((data) => data.json())
      .then((data) => setActivities(data))
      .catch((err) => console.log(err));
  }, []);
  return (
    <section>
      <div className="breadcrumb">
        <h1>
          <span
            onClick={() => {
              navigate("/reports");
            }}
          >
            Reports
          </span>{" "}
          &gt;
          <span
            onClick={() => {
              window.location.reload(false);
            }}
          >
            {" "}
            Activity History
          </span>
        </h1>
      </div>
      <hr />
      <div id="activity-workspace">
        <div>
          <img
            id="sortIcon"
            src={SortIcon}
            alt=""
            onClick={() => {
              setSort((curr) => !curr);
            }}
          />
          <div id="activityContainer">
            {activities.length > 0 ? (
              <div id="activityList">
                {activities
                  .filter((act) => {
                    if (filter) {
                      return act.action === filter;
                    } else {
                      return act;
                    }
                  })
                  .sort((a, b) => {
                    if (!sort) {
                      return (
                        Number(new Date(b.updatedAt)) -
                        Number(new Date(a.updatedAt))
                      );
                    }
                    return (
                      Number(new Date(a.updatedAt)) -
                      Number(new Date(b.updatedAt))
                    );
                  })
                  .map(({ _id, By, action, item, what, in: t, updatedAt }) => (
                    <ActivityTile
                      key={_id}
                      by={By.name}
                      what={what}
                      action={action}
                      item={item.name}
                      cat={t.name}
                      updatedAt={updatedAt}
                    />
                  ))}
              </div>
            ) : (
              <h1 className="na">No recent activities</h1>
            )}
          </div>
        </div>
        <div id="sortOptions">
          <h1>Filter Activities</h1>
          <hr />
          <div id="filterOptionsContainer">
            <label htmlFor="all">
              <input
                type="radio"
                name="filterOption"
                id="all"
                defaultChecked
                onChange={() => {
                  console.log("changes");
                  setFilter(false);
                }}
              />
              All Activities
            </label>
            <label htmlFor="moved">
              <input
                type="radio"
                name="filterOption"
                id="moved"
                value={"moved"}
                onChange={(e) => {
                  setFilter(e.target.value);
                }}
              />
              Moved
            </label>
            <label htmlFor="edited">
              <input
                type="radio"
                name="filterOption"
                id="edited"
                value={"edited"}
                onChange={(e) => {
                  setFilter(e.target.value);
                }}
              />
              Edited
            </label>
            <label htmlFor="deleted">
              <input
                type="radio"
                name="filterOption"
                id="deleted"
                value={"deleted"}
                onChange={(e) => {
                  setFilter(e.target.value);
                }}
              />
              Deleted
            </label>
            <label htmlFor="created">
              <input
                type="radio"
                name="filterOption"
                id="created"
                value={"created"}
                onChange={(e) => {
                  setFilter(e.target.value);
                }}
              />
              Created
            </label>
            <label htmlFor="ordered">
              <input
                type="radio"
                name="filterOption"
                id="ordered"
                value={"ordered"}
                onChange={(e) => {
                  setFilter(e.target.value);
                }}
              />
              Ordered
            </label>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReportsActivity;
