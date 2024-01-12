import React from "react";
import "../DefaultTile.css";
import Currency from "react-currency-formatter";
import DeleteIcon from "../../Images/Delete.png";
import { useSelector } from "react-redux";

const ItemTile = ({ id, name, updated, allItems, allOrders }) => {
  return (
    <div className="default-tile">
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
              {/* {items.length} Item{items.length > 1 && "s"} */}
            </p>
            <p className="price">
              <Currency
                currency="EUR"
                // quantity={amount}
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
            {/* <p className="updated-date">{date.toLocaleString()}</p> */}
          </div>
          {useSelector((state) => state.decodedToken.value.admin) && (
            <div className="delete-btn">
              <img src={DeleteIcon} alt="delete" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemTile;
