import React, { useEffect, useState } from "react";
import "../Inventory.css";
import ListOrderIcon from "../../Images/ListOrder.png";
import TileOrderIcon from "../../Images/TileOrder.png";
import Currency from "react-currency-formatter";
import ItemTile from "../ItemTile";
import AddIcon from "../../Images/Add.png";
import SearchIcon from "../../Images/Search.png";
import { useDispatch, useSelector } from "react-redux";
import { setListingOrder } from "../../Slices/ListingOrderSlice";
import AddItemPopUp from "../AddItemPopUp";
import { checkDB } from "../../Slices/CheckForDBUpdatesSlice";
import { useParams } from "react-router-dom";

const InventoryItem = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.value);
  const allItems = useSelector((state) => state.items.value);
  // const [items, setItems] = useState([]);
  // const [category, setCategory] = useState(false);
  let items = allItems.filter((item) => item.category.id === id);
  let category = categories.find((cat) => cat._id === id);
  const [search, setSearch] = useState("");
  const [addStat, setAddStat] = useState(false);
  let searchedItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    dispatch(checkDB());
  }, []);

  console.log(searchedItems);
  const close = () => {
    setAddStat(false);
  };

  return (
    <section>
      {addStat && <AddItemPopUp close={close} name={category.name} />}
      <div className="breadcrumb">
        <h1>Inventory &gt; {category && category.name}</h1>
      </div>
      <hr />
      <div id="inventory-workspace">
        <div id="topBtns">
          <div className="search-input">
            <img src={SearchIcon} alt="" />
            <input
              type="text"
              placeholder="Search Items"
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
              <span className="btn-text">ADD ITEM</span>
            </button>
          )}
        </div>
        <div id="workspaceDivider">
          <div>
            <div
              id="items"
              className={
                useSelector((state) => state.listingOrder.value) === "tile"
                  ? "tile-order"
                  : "list-order"
              }
            >
              {searchedItems.length > 0 ? (
                searchedItems.map((item) => (
                  <ItemTile
                    key={item._id}
                    id={item._id}
                    name={item.name}
                    updated={item.updatedAt}
                  />
                ))
              ) : (
                <p className="na">No results found</p>
              )}
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

export default InventoryItem;
