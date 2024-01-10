import React from "react";
import Currency from "react-currency-formatter";
import "./styles/OrderTile.css";

const OrderTile = ({ img, name, quantity, price }) => {
  return (
    <div className="orderTile">
      <img
        src={`http://localhost:3000/api/v1/items/image/${img}`}
        alt=""
        className="small-img"
      />
      <div className="info">
        <h1 className="orderName">{name}</h1>
        <div className="numbers">
          <p className="vl">
            {" "}
            {quantity} Unit{quantity > 1 && "s"}
          </p>
          <p className="price">
            <Currency
              currency="EUR"
              quantity={price}
              pattern="! ###,##0.00 "
              decimal=","
              group="."
            />
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderTile;
