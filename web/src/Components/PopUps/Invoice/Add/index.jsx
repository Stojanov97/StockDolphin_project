import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DiscardPopUp from "../../DiscardPopUp";
import CloseIcon from "../../../../Images/Close.png";
import { checkDB } from "../../../../Slices/CheckForDBUpdatesSlice";
import "./InvoicePopUp.css";
import Select from "react-select";
import { sliceLoading } from "../../../../Slices/LoadingSlice";
import socket from "../../../../socket"

const AddInvoicePopUp = ({ close, item, orders }) => {
  const dispatch = useDispatch();
  let suppliers = useSelector((state) => state.suppliers.value);

  const orderOptions = orders.map((order) => ({
    value: order,
    label: `${order.supplier.name} | ${order.quantity} unit${
      order.quantity > 1 ? "s" : ""
    } | ${order.price}€`,
  }));
  const supplierOptions = suppliers.map((sup) => ({
    value: sup,
    label: sup.name,
  }));

  const [selectedOrders, setSelectedOrders] = useState([]);
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

  const customStyles = {
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
  console.log(supplier);
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
          <Select
            id="suppliers"
            placeholder="Supplier*"
            value={supplier}
            onChange={setSupplier}
            options={supplierOptions}
            styles={customStyles}
          />
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
            options={orderOptions}
            styles={customStyles}
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
                supplier.value.name.length > 0 ||
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
              close();
              dispatch(sliceLoading(true));
              await fetch("/api/v1/invoices", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  name: name,
                  supplier: {
                    name: supplier.value.name,
                    id: supplier.value._id,
                  },
                  date: date,
                  orders: ordersMapped,
                  item: { name: item.name, id: item._id },
                  category: { name: item.category.name, id: item.category.id },
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
                    socket.emit("upis")
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
