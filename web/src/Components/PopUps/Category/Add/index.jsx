import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { checkDB } from "../../../../Slices/CheckForDBUpdatesSlice";
import "./AddCategoryPopUp.css";
import CloseIcon from "../../../../Images/Close.png";
import FileUploadIcon from "../../../../Images/AddImage.png";
import DiscardPopUp from "../../DiscardPopUp";

const AddCategoryPopUp = ({ close }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [image, setImage] = useState(false);
  const [file, setFile] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);
  const [error, setError] = useState(false);
  const closeDiscard = () => {
    setShowDiscard(false);
  };
  useEffect(() => {
    if (file.size > 2097152) {
      setError("File exceeds 2MB");
      setImage(false);
      setFile(false);
    } else if (file.size < 2097152) {
      setError(false);
    }
  }, [file]);
  return (
    <div className="backdrop">
      <div className="pop-up" id="categoryPopUp">
        {showDiscard && (
          <DiscardPopUp close={close} closeDiscard={closeDiscard} />
        )}
        <div className="header">
          <h1>Add Category</h1>
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
              if (name.length < 1) {
                return setError("Name is required");
              }
              let data = new FormData();
              data.append("name", name);
              if (file) data.append("photo", file);
              console.log(data);
              await fetch("http://localhost:3000/api/v1/categories", {
                method: "POST",
                body: data,
              })
                .then((data) => data.json())
                .then((data) => {
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
            ADD CATEGORY
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryPopUp;
