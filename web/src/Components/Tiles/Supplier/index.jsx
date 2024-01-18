import React, { useState } from "react";
import "./Supplier.css";
import DeleteIcon from "../../../Images/Delete.png";
import EditIcon from "../../../Images/EditGreen.png";
import SupplierEdit from "../../PopUps/Supplier/Edit";
import DeleteSupplier from "../../PopUps/Supplier/Delete";
import { useSelector } from "react-redux";

const SupplierTile = ({ name, address, email, phone, id }) => {
  const [edit, setEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  return (
    <>
      {edit && (
        <SupplierEdit
          name={name}
          address={address}
          email={email}
          phone={phone}
          id={id}
          close={() => setEdit(false)}
        />
      )}
      {showDelete && (
        <DeleteSupplier id={id} closeDelete={() => setShowDelete(false)} />
      )}
      <div className="supplier-tile">
        <div className="supplier-title">
          <h1>{name}</h1>
        </div>
        <div className="supplier-info">
          <div className="supplier-info-field">
            <h4>Address: </h4>
            <p>{address}</p>
          </div>
          <hr />
          <div className="supplier-info-field">
            <h4>Phone Number: </h4>
            <p>+389{phone}</p>
          </div>
          <hr />
          <div className="supplier-info-field">
            <h4>Email: </h4>
            <p>{email}</p>
          </div>
          <hr />
        </div>
        {useSelector((state) => state.decodedToken.value.admin) && (
          <div className="edit-supplier-containers">
            <div className="edit-btn-bg">
              <img
                src={EditIcon}
                alt="Edit"
                onClick={() => {
                  setEdit(true);
                }}
              />
            </div>
            <div
              className="edit-btn-bg"
              onClick={() => {
                setShowDelete(true);
              }}
            >
              <img src={DeleteIcon} alt="Delete" />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SupplierTile;
