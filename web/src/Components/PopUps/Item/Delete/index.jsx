import React from "react";
import { useDispatch } from "react-redux";
import { checkDB } from "../../../../Slices/CheckForDBUpdatesSlice";
import "./DeleteItemPopUp.css";
import { sliceLoading } from "../../../../Slices/LoadingSlice";
import socket from "../../../../socket";

const DeleteCategoryPopUp = ({ closeDelete, id, name }) => {
  const dispatch = useDispatch();
  return (
    <div className="backdrop">
      <div className="pop-up" id="deletePopUp">
        <p>
          Are you sure that you want to delete the {name} item? All associated
          orders in the item will be deleted. This action is irreversible
        </p>
        <div className="footer">
          <button onClick={() => closeDelete()}>CANCEL</button>
          <button
            onClick={() => {
              (async () => {
                closeDelete();
                dispatch(sliceLoading(true));
                await fetch(`/api/v1/items/${id}`, {
                  method: "DELETE",
                })
                  .then((data) => data.json())
                  .then((data) => {
                    if (data.success) {
                      dispatch(checkDB());
                      socket.emit("upis");
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
