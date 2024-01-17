import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { checkDB } from "../../../../Slices/CheckForDBUpdatesSlice";
import "../Add/AddCategoryPopUp.css";
import CloseIcon from "../../../../Images/Close.png";
import FileUploadIcon from "../../../../Images/AddImage.png";
import DiscardPopUp from "../../DiscardPopUp";

const EditCategoryPopUp = ({ close, name: categoryName }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [name, setName] = useState(categoryName);
  const [image, setImage] = useState(
    `http://localhost:3000/api/v1/categories/image/${id}`
  );
  let startImage = `http://localhost:3000/api/v1/categories/image/${id}`;
  const [file, setFile] = useState("old");
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
          <h1>Edit Category</h1>
          <img
            className="close-icon"
            src={CloseIcon}
            alt="close icon"
            onClick={() => {
              if (image !== startImage || name !== categoryName) {
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
            value={name}
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
            // value={`http://localhost:3000/api/v1/items/image/${id}`}
            accept=".jpg, .jpeg"
            onClick={(e) => {
              if (image) {
                e.preventDefault();
                setImage(false);
                setFile(false);
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
              if (image !== startImage || name !== categoryName) {
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
              if (!file) {
                data.append("removePhoto", "true");
              } else if (file !== "old") {
                data.append("photo", file);
              }
              await fetch(`http://localhost:3000/api/v1/categories/${id}`, {
                method: "PATCH",
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
            SAVE CHANGES
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCategoryPopUp;
