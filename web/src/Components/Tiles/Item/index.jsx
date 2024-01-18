import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Currency from "react-currency-formatter";
import "../DefaultTile.css";
import DeleteIcon from "../../../Images/Delete.png";
import DeleteItemPopUp from "../../PopUps/Item/Delete";

const ItemTile = ({ id, name, updated }) => {
  const navigate = useNavigate();
  const orders = useSelector((state) => state.orders.value).filter(
    (order) => order.item.id === id
  );
  const [deleteStat, setDeleteStat] = useState(false);
  let date = new Date(updated);

  return (
    <>
      {deleteStat && (
        <DeleteItemPopUp
          id={id}
          name={name}
          closeDelete={() => {
            setDeleteStat(false);
          }}
        />
      )}
      <div
        className={`default-tile ${
          useSelector((state) => state.listingOrder.value) === "tile"
            ? "tile-order-tile"
            : "list-order-tile"
        }`}
        onClick={() => {
          navigate(`/inventory/item/${id}`);
        }}
      >
        <img
          className="thumb"
          src={`http://localhost:3000/api/v1/items/image/${id}`}
          alt=""
        />
        <div className="info">
          <div className="top">
            <h1 className="default-tile-title">{name}</h1>
            <div className="tile-numbers-item">
              <p className="vl">
                {" "}
                {orders.length} Purchase{orders.length > 1 && "s"} on the record
              </p>
              <p className="price">
                <Currency
                  currency="EUR"
                  quantity={useSelector((state) => state.invoices.value)
                    .filter((invoice) => invoice.item.id === id)
                    .reduce((acc, curr) => acc + curr.total, 0)}
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
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteStat(true);
                }}
              >
                <img src={DeleteIcon} alt="delete" />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemTile;