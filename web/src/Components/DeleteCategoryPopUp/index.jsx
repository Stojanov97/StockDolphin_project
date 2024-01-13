import React from "react";
import "./DeleteCategoryPopUp.css";
import { useDispatch } from "react-redux";
import { checkDB } from "../../Slices/CheckForDBUpdatesSlice";

const DeleteCategoryPopUp = ({ closeDelete, id }) => {
  const dispatch = useDispatch();
  return (
    <div className="backdrop">
      <div className="pop-up" id="deletePopUp">
        <p>
          Are you sure that you want to delete? <br /> All the items in the
          category will be deleted.
        </p>
        <div className="footer">
          <button onClick={() => closeDelete()}>CANCEL</button>
          <button
            onClick={() => {
              (async () => {
                await fetch(`http://localhost:3000/api/v1/categories/${id}`, {
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
