import React, { useEffect, useState } from "react";
import "../DefaultTile.css";
import Currency from "react-currency-formatter";
import DeleteIcon from "../../Images/Delete.png";
import { useDispatch, useSelector } from "react-redux";
import { checkDB } from "../../Slices/CheckForDBUpdatesSlice";

const DefaultTile = ({ id, name, updated }) => {
  const allItems = useSelector((state) => state.items.value);
  const allOrders = useSelector((state) => state.orders.value);
  const dispatch = useDispatch();
  let date = new Date(updated);
  const [amount, setAmount] = useState(0);
  const items = allItems.filter((item) => item.category.id === id);
  let orders = [];
  useEffect(() => {
    for (let item of items) {
      let test = allOrders.filter((order) => order.item.id === item._id);
      if (test.length > 0) {
        orders = orders.concat(test);
      }
    }
  }, [items]);
  useEffect(() => {
    (() => {
      setAmount(orders.reduce((acc, curr) => acc + curr.price, 0));
    })();
  }, [orders]);

  return (
    <div
      className={`default-tile ${
        useSelector((state) => state.listingOrder.value) === "tile"
          ? "tile-order-tile"
          : "list-order-tile"
      }`}
    >
      <img
        className="thumb"
        src={`http://localhost:3000/api/v1/categories/image/${id}`}
        alt=""
      />
      <div className="info">
        <div className="top">
          <h1 className="default-tile-title">{name}</h1>
          <div className="tile-numbers">
            <p className="vl">
              {" "}
              {items.length} Item{items.length > 1 && "s"}
            </p>
            <p className="price">
              <Currency
                currency="EUR"
                quantity={amount}
                pattern="! ###,##0.00 "
                decimal=","
                group="."
              />
            </p>
          </div>
        </div>
        <div className="bottom">
          <div>
            <p className="updated-at-label">Updated At:</p>
            <p className="updated-date">{date.toLocaleString()}</p>
          </div>
          {useSelector((state) => state.decodedToken.value.admin) && (
            <div
              className="delete-btn"
              onClick={() => {
                fetch(`http://localhost:3000/api/v1/categories/${id}`, {
                  method: "DELETE",
                })
                  .then((data) => data.json())
                  .then((data) => {
                    if (data.success) {
                      dispatch(checkDB());
                    }
                  })
                  .catch((err) => console.log(err));
              }}
            >
              <img src={DeleteIcon} alt="delete" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DefaultTile;
