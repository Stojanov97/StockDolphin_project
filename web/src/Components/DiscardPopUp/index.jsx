import React from "react";
import "./DiscardPopUp.css";

const DiscardPopUp = ({ close, closeDiscard }) => {
  return (
    <div className="pop-up" id="discardChanges">
      <p>Discard unsaved changes?</p>
      <div className="footer">
        <button onClick={() => closeDiscard()}>CANCEL</button>
        <button
          onClick={() => {
            closeDiscard();
            close();
          }}
        >
          DISCARD
        </button>
      </div>
    </div>
  );
};

export default DiscardPopUp;
