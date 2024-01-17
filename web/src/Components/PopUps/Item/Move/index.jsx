import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./MoveItem.css";
import CloseIcon from "../../../../Images/Close.png";
import CategoryFolderIcon from "../../../../Images/CategoryFolder.png";
import DiscardPopUp from "../../DiscardPopUp";
import { checkDB } from "../../../../Slices/CheckForDBUpdatesSlice";

const MoveItemPopUp = ({ close, id }) => {
  const dispatch = useDispatch();
  const [moveTo, setMoveTo] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);
  const [err, setErr] = useState(false);
  const categories = useSelector((state) => state.categories.value);
  console.log(moveTo);
  return (
    <>
      {showDiscard && (
        <DiscardPopUp
          close={close}
          closeDiscard={() => {
            setShowDiscard(false);
          }}
        />
      )}
      <div className="backdrop">
        <div className="pop-up" id="movePopUp">
          <div className="header">
            <h1>Move Item</h1>
            <img
              className="close-icon"
              src={CloseIcon}
              alt="close icon"
              onClick={() => {
                if (moveTo) {
                  console.log("tuka");
                  setShowDiscard(true);
                } else {
                  close();
                }
              }}
            />
          </div>
          <div id="moveItemList">
            {categories &&
              categories.map((cat) => (
                <div key={cat._id}>
                  <input
                    type="radio"
                    value={JSON.stringify(cat)}
                    name="moveTo"
                    id={cat.name}
                    onChange={(e) => {
                      setMoveTo(JSON.parse(e.target.value));
                    }}
                  />
                  <label htmlFor={cat.name} className="radio-label">
                    <img
                      className="label-icon"
                      src={CategoryFolderIcon}
                      alt=""
                    />
                    {cat.name}
                  </label>
                </div>
              ))}
          </div>
          {err && <div className="move-err">{err}</div>}
          <div className="footer" id="moveFooter">
            <button
              type="submit"
              id="moveBtn"
              onClick={async () => {
                if (!moveTo) {
                  setErr("Please select a category");
                } else {
                  await fetch(`http://localhost:3000/api/v1/items/move/${id}`, {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      category: { id: moveTo._id, name: moveTo.name },
                    }),
                  })
                    .then((data) => data.json())
                    .then((data) => {
                      if (data.success == true) {
                        setErr(false);
                        dispatch(checkDB());
                        close();
                      } else {
                        setErr(data.err);
                      }
                    })
                    .catch((err) => console.log(err));
                }
              }}
            >
              Move Item
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MoveItemPopUp;
