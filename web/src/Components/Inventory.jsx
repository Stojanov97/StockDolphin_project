import React, { useEffect, useState } from "react";
import "./styles/Inventory.css";

const Inventory = () => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {}, []);
  return (
    <section>
      <div className="breadcrumb">
        <h1>Inventory</h1>
      </div>
      <hr />
      <div id="inventory-workspace">
        <div>
          <input type="text" placeholder="Search Categories" />
          <button>Add Category</button>
        </div>
        <div>
          <div className="inventory&info">
            <div className="info">
              <p>Categories: 4</p>
              <p>Items: 11</p>
              <p>Orders: 25</p>
              <p>Total Cost: 1250</p>
            </div>
            <div className="cats"></div>
          </div>
          <div className="btns">tiles vs list</div>
        </div>
      </div>
    </section>
  );
};

export default Inventory;
