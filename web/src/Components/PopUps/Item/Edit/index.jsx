import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkDB } from "../../../../Slices/CheckForDBUpdatesSlice";
import "./EditItem.css";
import CloseIcon from "../../../../Images/Close.png";
import FileUploadIcon from "../../../../Images/AddImage.png";
import GreenEditIcon from "../../../../Images/EditGreen.png";
import MoveIcon from "../../../../Images/MoveFolder.png";
import DiscardPopUp from "../../DiscardPopUp";
import MoveItemPopUp from "../Move";
import socket from "../../../../socket";
import noPhotoThumb from "../../../../Images/noImgNoProb.jpg";

const EditItem = ({ id }) => {
  const dispatch = useDispatch();
  const { admin } = useSelector((state) => state.decodedToken.value);
  const items = useSelector((state) => state.items.value);
  const [item, setItem] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState(noPhotoThumb);
  const [file, setFile] = useState("old");
  const [error, setError] = useState(false);
  const [showMove, setShowMove] = useState(false);

  useEffect(() => {
    setItem(items.find((item) => item._id === id));
  }, [items]);
  useEffect(() => {
    if (item) {
      setName(item.name);
      setImage(item.photo?`/api/v1/items/image/${id}`: noPhotoThumb)
    }
  }, [item]);
  useEffect(() => {
    if (file.size > 2097152) {
      setError("File exceeds 2MB");
      setImage(false);
      setFile(false);
    } else if (file.size < 2097152) {
      setError(false);
    }
  }, [file]);

  console.log(file);

  return (
    <>
      {showMove && (
        <MoveItemPopUp
          id={id}
          close={() => {
            setShowMove(false);
          }}
        />
      )}
      <div id="editItem">
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <label htmlFor="fileUpload" className="file-upload-container">
            {image ? (
              <>
                <img src={image} alt="chosen image" className="chosen-image" />
                {admin && (
                  <img src={GreenEditIcon} alt="" id="editItemImageEditBtn" />
                )}
              </>
            ) : (
              <>
                <img src={FileUploadIcon} alt="Upload Image" />
                <p>(Add photo, 2MB Total)</p>
              </>
            )}
          </label>
          <div id="editItemName">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              required
              placeholder="Name*"
              disabled={!admin}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          {error && <p className="error">{error}</p>}
          <input
            type="file"
            id="fileUpload"
            name="fileUpload"
            accept=".jpg, .jpeg"
            disabled={!admin}
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
          {admin && (
            <div id="editItemActions">
              <button
                className="interaction-btn"
                onClick={() => {
                  setShowMove(true);
                }}
              >
                <img src={MoveIcon} alt="" />
              </button>
              <button
                className="interaction-btn"
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
                  console.log("data", data);
                  await fetch(`/api/v1/items/${id}`, {
                    method: "PATCH",
                    body: data,
                  })
                    .then((data) => data.json())
                    .then((data) => {
                      console.log(data);
                      if (data.success === true) {
                        setError(false);
                        dispatch(checkDB());
                        socket.emit("upis")
                      } else {
                        setError(data.err);
                      }
                    })
                    .catch((err) => console.log(err));
                }}
              >
                SAVE
              </button>
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default EditItem;
