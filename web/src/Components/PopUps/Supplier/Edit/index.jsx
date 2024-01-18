import React, { useState } from "react";
import "../../../Tiles/Supplier/Supplier.css";
import "../style.css";
import DiscardPopUp from "../../DiscardPopUp";
import { useDispatch } from "react-redux";
import { checkDB } from "../../../../Slices/CheckForDBUpdatesSlice";

const SupplierEdit = ({ name, address, email, phone, id, close }) => {
  const dispatch = useDispatch();
  const [newName, setNewName] = useState(name);
  const [newAddress, setNewAddress] = useState(address);
  const [newEmail, setNewEmail] = useState(email);
  const [newPhone, setNewPhone] = useState(phone);
  const [discard, setDiscard] = useState(false);
  const [error, setError] = useState(false);
  return (
    <>
      {discard && (
        <DiscardPopUp close={close} closeDiscard={() => setDiscard(false)} />
      )}
      <div className="backdrop">
        <div className="pop-up supplier-edit">
          <div className="supplier-title">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <div className="supplier-info">
            <div className="supplier-info-field">
              <h4>Address: </h4>
              <input
                type="text"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
              />
            </div>
            <div className="supplier-info-field">
              <h4>Phone Number: </h4>
              <p id="phoneInputContainer">
                +389{" "}
                <input
                  type="number"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                />
              </p>
            </div>
            <div className="supplier-info-field">
              <h4>Email: </h4>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
          </div>
          {error && <p className="error">{error}</p>}
          <div className="footer">
            <button
              onClick={() => {
                if (
                  newName !== name ||
                  newAddress !== address ||
                  newEmail !== email ||
                  newPhone !== phone
                ) {
                  setDiscard(true);
                } else {
                  close();
                }
              }}
            >
              CANCEL
            </button>
            <button
              onClick={() => {
                if (newName.length < 3) {
                  return setError("Name must be at least 3 characters long");
                } else if (newAddress.length < 3) {
                  return setError("Address must be at least 3 characters long");
                } else if (newEmail.length < 3) {
                  return setError("Email must be at least 3 characters long");
                } else if (newPhone.length < 3) {
                  return setError("Phone must be at least 3 characters long");
                } else {
                  fetch(`http://localhost:3000/api/v1/suppliers/${id}`, {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem(
                        "accessToken"
                      )}`,
                    },
                    body: JSON.stringify({
                      name: newName,
                      address: newAddress,
                      email: newEmail,
                      phone: newPhone,
                    }),
                  })
                    .then((res) => res.json())
                    .then((data) => {
                      if (data.success === true) {
                        setError(false);
                        dispatch(checkDB());
                        close();
                      } else {
                        setError(data.err);
                      }
                    })
                    .catch((err) => {
                      setError(err);
                    });
                }
              }}
            >
              SAVE
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SupplierEdit;
