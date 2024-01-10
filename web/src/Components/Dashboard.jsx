import React, { useEffect, useState } from "react";
import user from "../Images/User.png";
import ActivityTile from "./ActivityTile";
import OrderTile from "./OrderTile";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import "./styles/Dashboard.css";
import DashboardSummaryTile from "./DashboardSummaryTile";
import DocumentIcon from "../Images/Documents.png";
import FolderIcon from "../Images/Folder.png";
import ListIcon from "../Images/Paper.png";
import CoinsIcon from "../Images/Coins.png";
import Currency from "react-currency-formatter";
import { jwtDecode } from "jwt-decode";

const Dashboard = ({ token }) => {
  const decoded = token === false ? false : jwtDecode(token);
  const [activities, setActivities] = useState([]);
  const [orders, setOrders] = useState([]);
  const [catNum, setCatNum] = useState(0);
  const [itemNum, setItemNum] = useState(0);
  const [orderNum, setOrderNum] = useState(0);
  const [orderTotal, setOrderTotal] = useState(0);
  useEffect(() => {
    fetch("http://localhost:3000/api/v1/items/recent")
      .then((data) => data.json())
      .then((data) => setActivities(data))
      .catch((err) => console.log(err));
    fetch("http://localhost:3000/api/v1/orders/recent")
      .then((data) => data.json())
      .then((data) => setOrders(data))
      .catch((err) => console.log(err));
    fetch("http://localhost:3000/api/v1/categories/length")
      .then((data) => data.json())
      .then((data) => setCatNum(data))
      .catch((err) => console.log(err));
    fetch("http://localhost:3000/api/v1/items/length")
      .then((data) => data.json())
      .then((data) => setItemNum(data))
      .catch((err) => console.log(err));
    fetch("http://localhost:3000/api/v1/orders/length")
      .then((data) => data.json())
      .then((data) => setOrderNum(data))
      .catch((err) => console.log(err));
    fetch("http://localhost:3000/api/v1/orders/total")
      .then((data) => data.json())
      .then((data) => setOrderTotal(data))
      .catch((err) => console.log(err));
  }, []);

  const chunk = (array, size) => {
    return array.reduce((chunks, current, index) => {
      if (index % size === 0) {
        chunks.push([current]);
      } else {
        chunks[chunks.length - 1].push(current);
      }
      return chunks;
    }, []);
  };

  return (
    <section>
      <div className="breadcrumb">
        <h1>Dashboard</h1>
        <div className="greeting">
          <h1>
            Welcome {decoded && decoded.name} {decoded && decoded.lastName}
          </h1>
          <img src={user} alt="" />
        </div>
      </div>
      <hr />
      <div id="main-workspace">
        <div id="inventorySummary">
          <h1 className="section-title">Inventory Summary</h1>
          <div id="summaryTileContainer">
            <DashboardSummaryTile
              key={"category"}
              img={FolderIcon}
              color={"#ffe4aa"}
              amount={catNum}
              title={"Categories"}
            />
            <DashboardSummaryTile
              key={"items"}
              img={DocumentIcon}
              color={"#c8e6ee"}
              amount={itemNum}
              title={"Items"}
            />
            <DashboardSummaryTile
              key={"order"}
              img={ListIcon}
              color={"#e5caff"}
              amount={orderNum}
              title={"Total Orders"}
            />
            <DashboardSummaryTile
              key={"Cost"}
              img={CoinsIcon}
              color={"#ffd5c0"}
              amount={
                <Currency
                  quantity={orderTotal}
                  pattern="! #,### "
                  currency="EUR"
                />
              }
              title={"Total Cost"}
            />
          </div>
        </div>
        <div id="recentActivity">
          <h1 className="section-title">Recent Activity</h1>
          <div id="activityList">
            {activities.map(({ _id, By, action, item, in: cat }) => (
              <ActivityTile
                key={_id}
                by={By.name}
                action={action}
                item={item.name}
                cat={cat.name}
              />
            ))}
          </div>
        </div>
        <div id="recentOrders">
          <h1 className="section-title">Recent Orders</h1>
          <Carousel
            showThumbs={false}
            showStatus={false}
            renderArrowPrev={(clickHandler, hasPrev) => {
              return (
                <div
                  onClick={clickHandler}
                  className={hasPrev ? "shown" : "hidden"}
                >
                  <ChevronLeftIcon className="carousel-btn" />
                </div>
              );
            }}
            renderArrowNext={(clickHandler, hasNext) => {
              return (
                <div
                  onClick={clickHandler}
                  className={hasNext ? "shown" : "hidden"}
                >
                  <ChevronRightIcon className="carousel-btn" />
                </div>
              );
            }}
            renderIndicator={(clickHandler, isSelected, index) => {
              return (
                <li
                  className={
                    isSelected ? "indicator-selected indicator" : "indicator"
                  }
                  onClick={clickHandler}
                  key={index}
                />
              );
            }}
          >
            {chunk(orders, 4).map((orderList, index) => (
              <div className="carousel-slide" key={index}>
                {orderList.map((order) => (
                  <OrderTile
                    key={order._id}
                    img={order.item.id}
                    name={order.item.name}
                    quantity={order.quantity}
                    price={order.price}
                  />
                ))}
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
