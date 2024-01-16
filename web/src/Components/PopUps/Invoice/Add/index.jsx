import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Currency from "react-currency-formatter";
import DiscardPopUp from "../../DiscardPopUp";
import CloseIcon from "../../../../Images/Close.png";
import { checkDB } from "../../../../Slices/CheckForDBUpdatesSlice";
import "./InvoicePopUp.css";
import Select from "react-select";

const AddInvoicePopUp = ({ close, item, orders }) => {
  const dispatch = useDispatch();
  const options = orders.map((order) => ({
    value: order,
    label: `${order.supplier.name} | ${order.quantity} unit${
      order.quantity > 1 && "s"
    } | ${order.price}€`,
  }));
  const [selectedOrders, setSelectedOrders] = useState([]);
  let suppliers = useSelector((state) => state.suppliers.value);
  let ordersMapped = selectedOrders.map((order) => ({
    id: order.value._id,
    price: order.value.price,
  }));
  const [supplier, setSupplier] = useState(false);
  const [date, setDate] = useState(false);
  const [name, setName] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);
  const [error, setError] = useState(false);
  const closeDiscard = () => {
    setShowDiscard(false);
  };
  return (
    <div className="backdrop">
      <div className="pop-up" id="invoicePopUp">
        {showDiscard && (
          <DiscardPopUp close={close} closeDiscard={closeDiscard} />
        )}
        <div className="header">
          <h1>Add Invoice</h1>
          <img
            className="close-icon"
            src={CloseIcon}
            alt="close icon"
            onClick={() => {
              if (
                supplier ||
                name.length > 0 ||
                selectedOrders.length > 0 ||
                date.length > 0
              ) {
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
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Invoice Name*"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
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
                    <option key={index} value={false} selected>
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
            <h2 className="na">No suppliers available</h2>
          )}
          <input
            type="date"
            name="date"
            id="date"
            required
            onChange={(e) => {
              console.log(e.target);
              setDate(e.target.value);
            }}
          />

          <Select
            id="orders"
            placeholder="Select Orders*"
            value={selectedOrders}
            onChange={setSelectedOrders}
            options={options}
            isMulti
            closeMenuOnSelect={false}
          />
          {error && <p className="error">{error}</p>}
          <hr />
        </form>
        <div className="footer">
          <button
            onClick={() => {
              if (
                supplier ||
                name.length > 0 ||
                selectedOrders.length > 0 ||
                date.length > 0
              ) {
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
              console.log(supplier);
              e.preventDefault();
              if (name.length < 1 || !name) {
                return setError("Please enter a name for the invoice");
              }
              if (!supplier) {
                return setError("Please select a supplier");
              }
              if (date.length < 1 || !date) {
                console.log(date);
                return setError("Please select a date");
              }
              if (!selectedOrders.length > 0) {
                return setError("Please select orders");
              }
              await fetch("http://localhost:3000/api/v1/invoices", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  name: name,
                  supplier: supplier,
                  date: date,
                  orders: ordersMapped,
                  item: { name: item.name, id: item._id },
                  category: item.category,
                  total: ordersMapped.reduce(
                    (acc, curr) => acc + curr.price,
                    0
                  ),
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
            }}
          >
            ADD INVOICE
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddInvoicePopUp;
