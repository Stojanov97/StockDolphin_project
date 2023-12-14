const {
  create,
  read,
  readByID,
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
  downloadOne,
  downloadAll,
  removeFile,
} = require("../../../pkg/files");

const createHandler = async (req, res) => {
  try {
    let userID = req.auth.id;
    let credentials = { ...req.body, ...{ By: userID } };
    await validate(credentials, CategoryCreate);
    let category = await create(credentials);
    await upload(req.files.photo, "cat", category._id);
    return await res.json({ success: true });
  } catch (err) {
    return res
      .status(500 || err.code)
      .json({ success: false, err: err.message });
  }
};

const readHandler = async (req, res) => {
  try {
    let categories = await read();
    let photos = await downloadAll("cat");
    console.log(photos);
    return await res.send("test");
  } catch (err) {
    return res
      .status(500 || err.code)
      .json({ success: false, err: err.message });
  }
};

const readOneByIDHandler = async (req, res) => {
  try {
  } catch (err) {
    return res
      .status(500 || err.code)
      .json({ success: false, err: err.message });
  }
};

const readOneByUserHandler = async (req, res) => {
  try {
  } catch (err) {
    return res
      .status(500 || err.code)
      .json({ success: false, err: err.message });
  }
};

const updateHandler = async (req, res) => {
  try {
  } catch (err) {
    return res
      .status(500 || err.code)
      .json({ success: false, err: err.message });
  }
};

const deleteHandler = async (req, res) => {
  try {
  } catch (err) {
    return res
      .status(500 || err.code)
      .json({ success: false, err: err.message });
  }
};

module.exports = {
  createHandler,
  readHandler,
  readOneByUserHandler,
  readOneByIDHandler,
  updateHandler,
  deleteHandler,
};
