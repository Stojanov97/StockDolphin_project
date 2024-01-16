import React from "react";
import "./MoveItem.css";
import CloseIcon from "../../../../Images/Close.png";

const MoveItemPopUp = ({ close }) => {
  return (
    <div className="backdrop">
      <div className="pop-up" id="movePopUp">
        <div className="header">
          <h1>Move Item</h1>
          <img
            className="close-icon"
            src={CloseIcon}
            alt="close icon"
            onClick={() => {
              close();
            }}
          />
        </div>
        <ul id="moveItemList">
          <li>test</li>
          <li>test2</li>
          <li>test3</li>
          <li>test4</li>
        </ul>
        <div className="footer" id="moveFooter">
          <button type="submit" id="moveBtn">
            MOVE
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoveItemPopUp;
