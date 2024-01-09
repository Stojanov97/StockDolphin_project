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
  downloadByID,
} = require("../../../pkg/files");

const createHandler = async (req, res) => {
  try {
    const { admin, username, id } = req.auth;
    if (admin === false) throw { code: 401, error: "You aren't an admin" };
    let data = {
      ...req.body,
      ...{ By: { name: username, id: id } },
    };
    await validate(data, CategoryCreate);
    let category = await create(data);
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
    const { id } = req.auth;
    let categories = await readByUserID(id);
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
    const { admin, username, id: userID } = req.auth;
    console.log(userID); //testiraj
    if (admin === false) throw { code: 401, error: "You aren't an admin" };
    const { id } = req.params;
    let data = {
      ...req.body,
      ...{ By: { name: username, id: userID } },
    };
    await validate(data, CategoryUpdate);
    await update(id, data);
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
    const { admin } = req.auth;
    if (admin === false) throw { code: 401, error: "You aren't an admin" };
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

const getImage = async (req, res) => {
  try {
    const path = await downloadByID("cat", req.params.id);
    return await res.sendFile(path, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Sent");
      }
    });
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
  getImage,
};
