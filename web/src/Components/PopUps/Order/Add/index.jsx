import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DiscardPopUp from "../../DiscardPopUp";
import CloseIcon from "../../../../Images/Close.png";
import { checkDB } from "../../../../Slices/CheckForDBUpdatesSlice";
import "./OrderAddPopUp.css";

const AddOrderPopUp = ({ close, item }) => {
  const dispatch = useDispatch();
  let suppliers = useSelector((state) => state.suppliers.value);
  const [supplier, setSupplier] = useState(false);
  const [quantity, setQuantity] = useState(false);
  const [totalPrice, setTotalPrice] = useState(false);
  const [date, setDate] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);
  const [error, setError] = useState(false);
  const closeDiscard = () => {
    setShowDiscard(false);
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
          {suppliers.length > 0 ? (
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
          )}
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
                await fetch("http://localhost:3000/api/v1/orders", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    supplier: supplier,
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
                      close();
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
