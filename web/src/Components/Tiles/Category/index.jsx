import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Currency from "react-currency-formatter";
import "../DefaultTile.css";
import DeleteIcon from "../../../Images/Delete.png";
import DeleteCategoryPopUp from "../../PopUps/Category/Delete";
import noImgThumb from "../../../Images/noImgNoProb.jpg";

const CategoryTile = ({ id, name, updated, photo }) => {
  console.log("testp",photo)
  const navigate = useNavigate();
  const items = useSelector((state) => state.items.value).filter(
    (item) => item.category.id === id
  );
  const invoices = useSelector((state) => state.invoices.value).filter(
    (invoice) => invoice.category.id === id
  );
  const [deleteStat, setDeleteStat] = useState(false);
  let date = new Date(updated);
  return (
    <>
      {deleteStat && (
        <DeleteCategoryPopUp
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
          navigate(`/inventory/${id}`);
        }}
      >
        <img className="thumb" src={photo? `/api/v1/categories/image/${id}?${Math.random()*10}`:noImgThumb} alt="category photo" loading="lazy" />
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
                  quantity={invoices.reduce((acc, curr) => acc + curr.total, 0)}
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
                <img src={DeleteIcon} alt="delete" loading="lazy"/>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryTile;
