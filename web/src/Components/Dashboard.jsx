import React, { useEffect, useState } from "react";
import user from "../Images/User.png";

const Dashboard = () => {
  const [activities, setActivities] = useState([]);
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3000/api/v1/items/recent")
      .then((data) => data.json())
      .then((data) => setActivities(data))
      .catch((err) => console.log(err));
    fetch("http://localhost:3000/api/v1/orders/recent")
      .then((data) => data.json())
      .then((data) => setOrders(data))
      .catch((err) => console.log(err));
  }, []);
  return (
    <section>
      <div className="breadcrumb">
        <h1>Dashboard</h1>
        <div className="greeting">
          <h1>Welcome Riste Stojanov</h1>
          <img src={user} alt="" />
        </div>
      </div>
      <hr />
      <div id="main-workspace">
        <div id="inventorySummary">Sum shit</div>
        <div id="recentActivity">
          {activities.map((activity) => (
            <div>{activity.toString()}</div>
          ))}
        </div>
        <div id="recentOrders"></div>
      </div>
    </section>
  );
};

export default Dashboard;
