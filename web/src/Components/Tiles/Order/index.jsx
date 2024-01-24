import React from "react";
import Currency from "react-currency-formatter";
import "./OrderTile.css";
import { useNavigate } from "react-router-dom";

const OrderTile = ({ id, name, quantity, price }) => {
  const navigate = useNavigate();
  return (
    <div
      className="orderTile"
      onClick={() => {
        navigate(`/inventory/item/${id}`);
      }}
    >
      <img src={`/api/v1/items/image/${id}`} alt="" className="small-img" />
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
