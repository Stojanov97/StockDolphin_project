import React, { useEffect, useState } from "react";
import "./Suppliers.css";
import { useDispatch, useSelector } from "react-redux";
import { checkDB } from "../../Slices/CheckForDBUpdatesSlice";
import SearchIcon from "../../Images/Search.png";
import AddIcon from "../../Images/Add.png";
import SupplierTile from "../../Components/Tiles/Supplier";
import AddSupplier from "../../Components/PopUps/Supplier/Add";

const Suppliers = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkDB());
  }, []);
  const suppliers = useSelector((state) => state.suppliers.value);
  const [search, setSearch] = useState("");
  const [addStat, setAddStat] = useState(false);
  let searchedSuppliers = suppliers.filter((sup) =>
    sup.name.toLowerCase().includes(search.toLowerCase())
  );
  const close = () => {
    setAddStat(false);
  };
  return (
    <section>
      {addStat && <AddSupplier close={close} />}
      <div className="breadcrumb">
        <h1
          onClick={() => {
            window.location.reload(false);
          }}
        >
          Suppliers
        </h1>
      </div>
      <hr />
      <div id="suppliers-workspace">
        <div id="topBtns">
          <div className="search-input">
            <img src={SearchIcon} alt="" />
            <input
              type="text"
              placeholder="Search Suppliers"
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
              <span className="btn-text">ADD SUPPLIER</span>
            </button>
          )}
        </div>
        <div id="supplierContainer">
          {searchedSuppliers.length > 0 ? (
            searchedSuppliers.map((supplier) => (
              <SupplierTile
                key={supplier._id}
                name={supplier.name}
                address={supplier.address}
                phone={supplier.phone}
                email={supplier.email}
                id={supplier._id}
              />
            ))
          ) : (
            <p className="na">No Suppliers Found</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Suppliers;
