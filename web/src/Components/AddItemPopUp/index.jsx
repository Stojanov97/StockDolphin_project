import React, { useEffect, useState } from "react";
import "./AddItemPopUp.css";
import CloseIcon from "../../Images/Close.png";
import FileUploadIcon from "../../Images/AddImage.png";
import DiscardPopUp from "../DiscardPopUp";
import { useDispatch } from "react-redux";
import { checkDB } from "../../Slices/CheckForDBUpdatesSlice";
import { useParams } from "react-router-dom";

const AddItemPopUp = ({ close, name: categoryName }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [image, setImage] = useState(false);
  const [file, setFile] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);
  const [error, setError] = useState(false);
  const { id } = useParams();
  const closeDiscard = () => {
    setShowDiscard(false);
  };
  useEffect(() => {
    if (file.size > 2097152) {
      setError("File exceeds 2MB");
      setImage(false);
      setFile(false);
    }
  }, [file]);
  return (
    <div className="backdrop">
      <div className="pop-up" id="categoryPopUp">
        {showDiscard && (
          <DiscardPopUp close={close} closeDiscard={closeDiscard} />
        )}
        <div className="header">
          <h1>Add Item</h1>
          <img
            className="close-icon"
            src={CloseIcon}
            alt="close icon"
            onClick={() => {
              if (image || name) {
                setShowDiscard(true);
              } else {
                close();
              }
            }}
          />
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            type="text"
            required
            placeholder="Name*"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <hr />
          <label htmlFor="fileUpload" className="file-upload-container">
            {image ? (
              <img src={image} alt="chosen image" className="chosen-image" />
            ) : (
              <>
                <img src={FileUploadIcon} alt="Upload Image" />
                <p>(Add photo, 2MB Total)</p>
              </>
            )}
          </label>
          {error && <p className="error">{error}</p>}
          <input
            type="file"
            id="fileUpload"
            name="fileUpload"
            accept=".jpg, .jpeg"
            onClick={(e) => {
              if (image) {
                e.preventDefault();
                setImage(false);
              }
            }}
            onChange={(e) => {
              setFile(e.target.files[0]);
              setImage(URL.createObjectURL(e.target.files[0]));
            }}
          />
          <hr />
        </form>
        <div className="footer">
          <button
            onClick={() => {
              if (image || name) {
                setShowDiscard(true);
              } else {
                close();
              }
            }}
          >
            CANCEL
          </button>
          <button
            type="submit"
            onClick={async (e) => {
              e.preventDefault();
              let data = new FormData();
              data.append("name", name);
              data.append("category", id);
              data.append("categoryName", categoryName);
              if (file) data.append("photo", file);
              console.log(data);
              await fetch("http://localhost:3000/api/v1/items", {
                method: "POST",
                body: data,
              })
                .then((data) => data.json())
                .then((data) => {
                  console.log(data);
                  if (data.success === true) {
                    setError(false);
                    dispatch(checkDB());
                    close();
                  } else {
                    setError(data.err);
                  }
                })
                .catch((err) => console.log(err));
            }}
          >
            ADD ITEM
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddItemPopUp;
