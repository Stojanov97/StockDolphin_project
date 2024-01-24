import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DiscardPopUp from "../../DiscardPopUp";
import CloseIcon from "../../../../Images/Close.png";
import { checkDB } from "../../../../Slices/CheckForDBUpdatesSlice";
import "./OrderAddPopUp.css";
import Select from "react-select";
import { sliceLoading } from "../../../../Slices/LoadingSlice";
import socket from "../../../../socket";

const AddOrderPopUp = ({ close, item }) => {
  const dispatch = useDispatch();
  let suppliers = useSelector((state) => state.suppliers.value);
  const supplierOptions = suppliers.map((sup) => ({
    value: sup,
    label: sup.name,
  }));
  const [supplier, setSupplier] = useState(false);
  const [quantity, setQuantity] = useState(false);
  const [totalPrice, setTotalPrice] = useState(false);
  const [date, setDate] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);
  const [error, setError] = useState(false);
  const closeDiscard = () => {
    setShowDiscard(false);
  };

  const customStyles = {
    container: (provided, state) => ({
      ...provided,
      width: "90%",
      borderBottom: "1px solid var(--primary-text)",
      fontSize: "32px",
      fontWeight: "600",
    }),
    control: (provided, state) => ({
      ...provided,
      border: "none",
      outline: "none",
      cursor: "pointer",
      backgroundColor: "transparent",
      ":focus": {
        outline: "green",
        border: "none",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: "var(--background)",
      color: "var(--primary-text)",
      border: "none",
      outline: "none",
      height: "50px",
      cursor: "pointer",
    }),
    menu: (provided, state) => ({
      ...provided,
      maxHeight: "330px",
      overflow: "scroll",
      backgroundColor: "var(--background)",
      width: "520px",
    }),
    valueContainer: (provided, state) => ({
      ...provided,
      display: "flex",
      flexDirection: "row",
      flexWrap: "nowrap",
      overflow: "scroll",
    }),
    multiValue: (provided, state) => ({
      ...provided,
      flexShrink: "0",
      backgroundColor: "var(--primary-color)",
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: "var(--primary-text)",
    }),
    multiValueLabel: (provided, state) => ({
      ...provided,
      color: "var(--primary-text)",
    }),
  };

  return (
    <div className="backdrop">
      <div className="pop-up" id="orderPopUp">
        {showDiscard && (
          <DiscardPopUp close={close} closeDiscard={closeDiscard} />
        )}
        <div className="header">
          <h1>Add Order</h1>
          <img
            className="close-icon"
            src={CloseIcon}
            alt="close icon"
            onClick={() => {
              if (supplier || quantity || totalPrice || date) {
                setShowDiscard(true);
              } else {
                close();
              }
            }}
          />
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Select
            id="supplier"
            placeholder="Suppliers*"
            value={supplier}
            onChange={setSupplier}
            options={supplierOptions}
            styles={customStyles}
          />
          {/* {suppliers.length > 0 ? (
            <select
              name="suppliers"
              id="suppliers"
              onChange={(e) => {
                setSupplier(JSON.parse(e.target.value));
              }}
            >
              {suppliers.map(({ _id, name }, index) => (
                <>
                  {index === 0 && (
                    <option selected value={false}>
                      Supplier*
                    </option>
                  )}
                  <option
                    key={_id}
                    value={JSON.stringify({ name: name, id: _id })}
                  >
                    {name}
                  </option>
                </>
              ))}
            </select>
          ) : (
            <h2>No suppliers available</h2>
          )} */}
          <input
            type="number"
            placeholder="Quantity*"
            required
            onChange={(e) => setQuantity(e.target.value)}
          />
          <input
            type="number"
            placeholder="Total Price*"
            required
            onChange={(e) => {
              setTotalPrice(e.target.value);
            }}
          />
          <input
            type="date"
            name="date"
            id="date"
            required
            onChange={(e) => {
              setDate(e.target.value);
            }}
          />
          {error && <p className="error">{error}</p>}
          <hr />
        </form>
        <div className="footer">
          <button
            onClick={() => {
              if (supplier || quantity || totalPrice || date) {
                setShowDiscard(true);
              } else {
                close();
              }
            }}
          >
            CANCEL
          </button>
          <button
            type="submit"
            onClick={async (e) => {
              e.preventDefault();
              if (!supplier) {
                return setError("Please select a supplier");
              } else if (!quantity) {
                return setError("Please provide an amount");
              } else if (!totalPrice) {
                return setError("Please provide a total price");
              } else if (!date) {
                return setError("Please select a date");
              } else {
                close();
                dispatch(sliceLoading(true))
                await fetch("/api/v1/orders", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    supplier: {
                      name: supplier.value.name,
                      id: supplier.value._id,
                    },
                    quantity: quantity,
                    price: totalPrice,
                    date: date,
                    category: item.category,
                    item: { name: item.name, id: item._id },
                  }),
                })
                  .then((data) => data.json())
                  .then((data) => {
                    if (data.success === true) {
                      setError(false);
                      dispatch(checkDB());
                      socket.emit("upis")
                    } else {
                      setError(data.err);
                    }
                  })
                  .catch((err) => console.log(err));
              }
            }}
          >
            ADD ORDER
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddOrderPopUp;
