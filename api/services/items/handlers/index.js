const {
  create,
  read,
  readByUserID,
  update,
  remove,
} = require("../../../pkg/items");
const { ItemCreate, ItemUpdate } = require("../../../pkg/items/validate");
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
    let data = {
      ...req.body,
      ...{ By: userID },
    };
    await validate(data, ItemCreate);
    let item = await create(data);
    // console.log(req.files);
    req.files && upload(req.files.photo, "item", item._id);
    return await res.json({ success: true });
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const readHandler = async (req, res) => {
  try {
    let items = await read();
    let photos = await downloadAll("item");
    console.log(photos);
    items = items.map((item) => {
      return {
        ...item._doc,
        ...{
          photo: photos.find(({ id }) => id == item._doc._id) || false,
        },
      };
    });
    return await res.json(items);
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const readByUserHandler = async (req, res) => {
  try {
    let userID = req.auth.id;
    let items = await readByUserID(userID);
    let photos = await downloadAll("item");
    items = items.map((item) => {
      return {
        ...item._doc,
        ...{
          photo: photos.find(({ id }) => id == item._doc._id) || false,
        },
      };
    });
    return res.json(items);
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const updateHandler = async (req, res) => {
  try {
    if (req.auth.admin === false)
      throw { code: 401, error: "You aren't an admin" };
    const { id } = req.params;
    await validate(req.body, ItemUpdate);
    await update(id, req.body);
    req.files && updateFile(req.files.photo, "item", id);
    return await res.json({ success: true });
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const deleteHandler = async (req, res) => {
  try {
    if (req.auth.admin === false)
      throw { code: 401, error: "You aren't an admin" };
    const { id } = req.params;
    await remove(id);
    await removeFile("item", id);
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
