import React from "react";
import { useDispatch } from "react-redux";
import { checkDB } from "../../../../Slices/CheckForDBUpdatesSlice";
import { sliceLoading } from "../../../../Slices/LoadingSlice";
import socket from "../../../../socket";

const DeleteSupplier = ({ id, closeDelete }) => {
  const dispatch = useDispatch();
  return (
    <div className="backdrop">
      <div className="pop-up" id="deletePopUp">
        <p>
          Are you sure that you want to delete this supplier? This action cannot
          be undone.
        </p>
        <div className="footer">
          <button onClick={() => closeDelete()}>CANCEL</button>
          <button
            onClick={() => {
              (async () => {
                closeDelete();
                dispatch(sliceLoading(true))
                await fetch(`/api/v1/suppliers/${id}`, {
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

export default DeleteSupplier;
