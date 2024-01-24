import React, { useState } from "react";
import "./refresh.css";
import { useDispatch } from "react-redux";
import { sliceLoading } from "../../Slices/LoadingSlice";
import { checkDB } from "../../Slices/CheckForDBUpdatesSlice";

const RefreshAlert = ({ close }) => {
  const dispatch = useDispatch();
  const [discard, setDiscard] = useState(false);
  return (
    <>
      {discard && (
        <div className="backdrop">
          <div className="pop-up" id="discardChanges">
            <p>Are you sure that you don't consider updating your data?</p>
            <div className="footer">
              <button onClick={() => setDiscard(false)}>NO</button>
              <button
                onClick={() => {
                  setDiscard(false);
                  close();
                }}
              >
                YES
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="alert">
        <p>We detected some updates, you might want to reload the data</p>
        <div className="btn-container">
          <button
            className="interaction-btn"
            onClick={() => {
              setDiscard(true);
            }}
          >
            Cancel
          </button>
          <button
            className="interaction-btn"
            onClick={() => {
              dispatch(sliceLoading(true));
              close();
              dispatch(checkDB());
            }}
          >
            Reload
          </button>
        </div>
      </div>
    </>
  );
};

export default RefreshAlert;
