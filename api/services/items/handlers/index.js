const {
  create,
  read,
  readByID,
  readByUserID,
  readByCategory,
  update,
  remove,
} = require("../../../pkg/items");
const activity = require("../../../pkg/activity");
const {
  ItemCreate,
  ItemUpdate,
  ItemMove,
} = require("../../../pkg/items/validate");
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
      name: req.body.name,
      category: { id: req.body.category, name: req.body.categoryName },
      By: { id: id, name: username },
    };
    await validate(data, ItemCreate);
    let item = await create(data);
    req.files && upload(req.files.photo, "item", item._id);
    await activity.create({
      By: { name: username, id: id },
      action: "created",
      what: "item",
      item: { id: item._id, name: item.name },
      in: { id: req.body.category, name: req.body.categoryName },
    });
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
    const { id } = req.auth;
    let items = await readByUserID(id);
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

const readByCategoryHandler = async (req, res) => {
  try {
    const { id } = req.params;
    let items = await readByCategory(id);
    // let photos = await downloadAll("item");
    // items = items.map((item) => {
    //   return {
    //     ...item._doc,
    //     ...{
    //       photo: photos.find(({ id }) => id == item._doc._id) || false,
    //     },
    //   };
    // });
    return res.json(items);
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const updateHandler = async (req, res) => {
  try {
    const { admin, username, id: userID } = req.auth;
    if (admin === false) throw { code: 401, error: "You aren't an admin" };
    const { id } = req.params;
    let data = {
      name: req.body.name,
      By: { id: userID, name: username },
    };
    await validate(data, ItemUpdate);
    let item = await readByID(id);
    req.files && updateFile(req.files.photo, "item", id);
    await update(id, data);
    await activity.create({
      By: { name: username, id: userID },
      action: "edited",
      what: "item",
      item: { id: item._id, name: item.name },
      in: item.category,
    });
    return await res.json({ success: true });
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const moveHandler = async (req, res) => {
  try {
    const { admin, username, id: userID } = req.auth;
    if (admin === false) throw { code: 401, error: "You aren't an admin" };
    const { id } = req.params;
    let data = {
      category: { id: req.body.category, name: req.body.categoryName },
      By: { id: userID, name: username },
    };
    await validate(data, ItemMove);
    await update(id, data);
    let item = await readByID(id); //
    await activity.create({
      By: { name: username, id: userID },
      action: "moved",
      what: "item",
      item: { id: id, name: item.name },
      in: item.category,
    });
    ////
    // await activity.create({
    //   By: { name: username, id: userID },
    //   action: "created",
    //   item: { id: item._id, name: item.name },
    //   in: { id: req.body.category, name: req.body.categoryName },
    // });
    return await res.json({ success: true });
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};
const deleteHandler = async (req, res) => {
  try {
    const { admin, username, id: userID } = req.auth;
    if (admin === false) throw { code: 401, error: "You aren't an admin" };
    const { id } = req.params;
    let item = await readByID(id);
    await remove(id);
    await removeFile("item", id);
    await activity.create({
      By: { name: username, id: userID },
      action: "deleted",
      what: "item",
      item: { id: item._id, name: item.name },
      in: item.category,
    });
    return await res.json({ success: true });
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const readActivityHandler = async (req, res) => {
  try {
    return await res.json(await activity.read());
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const getImage = async (req, res) => {
  try {
    const path = await downloadByID("item", req.params.id);
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

const getLength = async (req, res) => {
  try {
    return res.json((await read()).length);
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
  readByCategoryHandler,
  updateHandler,
  moveHandler,
  deleteHandler,
  readActivityHandler,
  getImage,
  getLength,
};
