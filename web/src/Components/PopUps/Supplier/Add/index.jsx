import React, { useEffect, useState } from "react";
import "../style.css";
import CloseIcon from "../../../../Images/Close.png";
import DiscardPopUp from "../../DiscardPopUp";
import { useDispatch } from "react-redux";
import { checkDB } from "../../../../Slices/CheckForDBUpdatesSlice";
import { sliceLoading } from "../../../../Slices/LoadingSlice";
import socket from "../../../../socket";

const AddSupplier = ({ close }) => {
  const dispatch = useDispatch();
  const [discard, setDiscard] = useState(false);
  const [name, setName] = useState(false);
  const [address, setAddress] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(false);
  const [email, setEmail] = useState(false);
  const [err, setErr] = useState(false);

  return (
    <>
      {discard && (
        <DiscardPopUp
          close={close}
          closeDiscard={() => {
            setDiscard(false);
          }}
        />
      )}
      <div className="backdrop">
        <div className="pop-up supplier-pop-up">
          <div className="header">
            <h1>Add Supplier</h1>
            <img
              src={CloseIcon}
              alt="close"
              className="close-icon"
              onClick={() => {
                if (name || address || phoneNumber || email) {
                  return setDiscard(true);
                } else {
                  return close();
                }
              }}
            />
          </div>
          <form>
            <input
              type="text"
              required
              placeholder="Name*"
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              required
              placeholder="Address*"
              onChange={(e) => setAddress(e.target.value)}
            />
            <input
              type="number"
              required
              placeholder="Phone Number*"
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <input
              type="email"
              required
              placeholder="Email*"
              onChange={(e) => setEmail(e.target.value)}
            />
            {err && <p className="error">{err}</p>}
          </form>
          <div className="footer">
            <button
              onClick={() => {
                if (name || address || phoneNumber || email) {
                  return setDiscard(true);
                } else {
                  return close();
                }
              }}
            >
              CANCEL
            </button>
            <button
              onClick={() => {
                if (!name) {
                  return setErr("Name is required");
                } else if (!address) {
                  return setErr("Address is required");
                } else if (!phoneNumber) {
                  return setErr("Phone Number is required");
                } else if (!email) {
                  return setErr("Email is required");
                } else {
                  setErr(false);
                  close();
                  dispatch(sliceLoading(true))
                  fetch("/api/v1/suppliers", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      name: name,
                      address: address,
                      phone: phoneNumber,
                      email: email,
                    }),
                  })
                    .then((res) => res.json())
                    .then((data) => {
                      if (data.success === true) {
                        dispatch(checkDB());
                        socket.emit("upis")
                      } else {
                        setErr(data.err);
                      }
                    })
                    .catch((err) => {
                      setErr(err);
                    });
                }
              }}
            >
              ADD SUPPLIER
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddSupplier;
