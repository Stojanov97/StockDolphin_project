import React, { useEffect, useState } from "react";
import "./InventoryCategory.css";
import ListOrderIcon from "../../Images/ListOrder.png";
import TileOrderIcon from "../../Images/TileOrder.png";
import Currency from "react-currency-formatter";
import CategoryTile from "../CategoryTile";
import AddIcon from "../../Images/Add.png";
import SearchIcon from "../../Images/Search.png";
import { useDispatch, useSelector } from "react-redux";
import { setListingOrder } from "../../Slices/ListingOrderSlice";
import EditCategoryPopUp from "../AddCategoryPopUp";
import { checkDB } from "../../Slices/CheckForDBUpdatesSlice";

const Inventory = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkDB());
  }, []);
  const categories = useSelector((state) => state.categories.value);
  const items = useSelector((state) => state.items.value);
  const orders = useSelector((state) => state.orders.value);
  const [search, setSearch] = useState("");
  const [addStat, setAddStat] = useState(false);
  let searchedCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );
  const close = () => {
    setAddStat(false);
  };
  return (
    <section>
      {addStat && <EditCategoryPopUp close={close} />}
      <div className="breadcrumb">
        <h1>Inventory</h1>
      </div>
      <hr />
      <div id="inventory-workspace">
        <div id="topBtns">
          <div className="search-input">
            <img src={SearchIcon} alt="" />
            <input
              type="text"
              placeholder="Search Categories"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>
          {useSelector((state) => state.decodedToken.value.admin) && (
            <button
              className="interaction-btn"
              onClick={() => {
                setAddStat(true);
              }}
            >
              <div className="btn-bg square-bg">
                <img src={AddIcon} alt="" />
              </div>
              <span className="btn-text">ADD CATEGORY</span>
            </button>
          )}
        </div>
        <div id="workspaceDivider">
          <div>
            <div id="info">
              <div>
                Categories: <b>{categories.length}</b>
              </div>
              <div>
                Items: <b>{items.length}</b>
              </div>
              <div>
                Orders: <b>{orders.length}</b>
              </div>
              <div>
                Total Cost:{" "}
                <b>
                  {" "}
                  <Currency
                    quantity={orders.reduce((acc, curr) => acc + curr.price, 0)}
                    currency="EUR"
                    pattern="! ##,##0.00"
                  />
                </b>
              </div>
            </div>
            <div
              id="categories"
              className={
                useSelector((state) => state.listingOrder.value) === "tile"
                  ? "tile-order"
                  : "list-order"
              }
            >
              {searchedCategories.map((cat) => (
                <CategoryTile
                  key={cat._id}
                  id={cat._id}
                  name={cat.name}
                  updated={cat.updatedAt}
                />
              ))}
            </div>
          </div>
          <div className="view-btns">
            <img
              className="order-type-btn"
              src={TileOrderIcon}
              alt="Tile order"
              onClick={() => {
                dispatch(setListingOrder("tile"));
              }}
            />
            <img
              className="order-type-btn"
              src={ListOrderIcon}
              alt="List order"
              onClick={() => {
                dispatch(setListingOrder("list"));
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Inventory;
