import React from "react";
import "./DeleteItemPopUp.css";
import { useDispatch } from "react-redux";
import { checkDB } from "../../Slices/CheckForDBUpdatesSlice";

const DeleteCategoryPopUp = ({ closeDelete, id }) => {
  const dispatch = useDispatch();
  return (
    <div className="backdrop">
      <div className="pop-up" id="deletePopUp">
        <p>Do you want to delete this item?</p>
        <div className="footer">
          <button onClick={() => closeDelete()}>CANCEL</button>
          <button
            onClick={() => {
              (async () => {
                await fetch(`http://localhost:3000/api/v1/items/${id}`, {
                  method: "DELETE",
                })
                  .then((data) => data.json())
                  .then((data) => {
                    if (data.success) {
                      dispatch(checkDB());
                    }
                  })
                  .catch((err) => console.log(err));
                closeDelete();
              })();
            }}
          >
            CONFIRM
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCategoryPopUp;
