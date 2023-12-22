const path = require("path");
const {
  create,
  read,
  readByUserID,
  update,
  remove,
} = require("../../../pkg/categories");
const {
  CategoryCreate,
  CategoryUpdate,
} = require("../../../pkg/categories/validate");
const { validate } = require("../../../pkg/validator");
const {
  upload,
  downloadAll,
  updateFile,
  removeFile,
} = require("../../../pkg/files");

const createHandler = async (req, res) => {
  try {
    let userID = req.auth.id;
    if (req.auth.admin === false)
      throw { code: 401, error: "You aren't an admin" };
    let credentials = { ...req.body, ...{ By: userID } };
    await validate(credentials, CategoryCreate);
    let category = await create(credentials);
    // console.log(req.files);
    req.files && upload(req.files.photo, "cat", category._id);
    return await res.json({ success: true });
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const readHandler = async (req, res) => {
  try {
    let categories = await read();
    let photos = await downloadAll("cat");
    console.log(photos);
    categories = categories.map((cat) => {
      return {
        ...cat._doc,
        ...{
          photo: photos.find(({ id }) => id == cat._doc._id) || false,
        },
      };
    });
    return await res.json(categories);
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const readByUserHandler = async (req, res) => {
  try {
    let userID = req.auth.id;
    let categories = await readByUserID(userID);
    let photos = await downloadAll("cat");
    categories = categories.map((cat) => {
      return {
        ...cat._doc,
        ...{
          photo: photos.find(({ id }) => id == cat._doc._id) || false,
        },
      };
    });
    return res.json(categories);
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const updateHandler = async (req, res) => {
  try {
    if (req.auth.admin === false) return res.status(401).send("Unauthorized");
    const { id } = req.params;
    await validate(req.body, CategoryUpdate);
    await update(id, req.body);
    req.files && updateFile(req.files.photo, "cat", id);
    return await res.json({ success: true });
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const deleteHandler = async (req, res) => {
  try {
    if (req.auth.admin === false) return res.status(401).send("Unauthorized");
    const { id } = req.params;
    await remove(id);
    await removeFile("cat", id);
    return await res.json({ success: true });
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

module.exports = {
  createHandler,
  readHandler,
  readByUserHandler,
  updateHandler,
  deleteHandler,
};
