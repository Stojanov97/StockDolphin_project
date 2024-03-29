import React from "react";
import { useDispatch } from "react-redux";
import { checkDB } from "../../../../Slices/CheckForDBUpdatesSlice";
import "./DeleteCategoryPopUp.css";
import { sliceLoading } from "../../../../Slices/LoadingSlice";
import socket from "../../../../socket"

const DeleteCategoryPopUp = ({ closeDelete, id, name }) => {
  const dispatch = useDispatch();
  return (
    <div className="backdrop">
      <div className="pop-up" id="deletePopUp">
        <p>
          Are you sure you want to delete the {name} Category? All Items in the
          category and all associated orders will be permanently deleted. This
          action is irreversible
        </p>
        <div className="footer">
          <button onClick={() => closeDelete()}>CANCEL</button>
          <button
            onClick={() => {
              (async () => {
                closeDelete();
                dispatch(sliceLoading(true))
                await fetch(`/api/v1/categories/${id}`, {
                  method: "DELETE",
                })
                  .then((data) => data.json())
                  .then((data) => {
                    if (data.success) {
                      dispatch(checkDB());
                      socket.emit("upis")
                    }
                  })
                  .catch((err) => console.log(err));
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
