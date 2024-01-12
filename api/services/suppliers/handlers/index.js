const {
  create,
  read,
  readByID,
  update,
  remove,
} = require("../../../pkg/suppliers");
const activity = require("../../../pkg/activity");
const {
  SupplierCreate,
  SupplierUpdate,
} = require("../../../pkg/suppliers/validate");
const { validate } = require("../../../pkg/validator");

const createHandler = async (req, res) => {
  try {
    const { admin, id, username } = req.auth;
    if (admin === false) throw { code: 401, error: "You aren't an admin" };
    let data = { ...req.body, ...{ By: { id: id, name: username } } };
    await validate(data, SupplierCreate);
    let supplier = await create(data);
    await activity.create({
      By: { id: id, name: username },
      action: "created",
      what: "supplier",
      item: { name: supplier.name, id: supplier._id },
      in: { name: supplier.name, id: supplier._id },
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
    return await res.json(await read());
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const updateHandler = async (req, res) => {
  try {
    const { admin, id: userID, username } = req.auth;
    if (admin === false) throw { code: 401, error: "You aren't an admin" };
    const { id } = req.params;
    let data = { ...req.body, ...{ By: { id: userID, name: username } } };
    await validate(data, SupplierUpdate);
    await update(id, data);
    let supplier = await readByID(id);
    await activity.create({
      By: { id: userID, name: username },
      action: "edited",
      what: "supplier",
      item: { name: supplier.name, id: supplier._id },
      in: { name: supplier.name, id: supplier._id },
    });
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
    let supplier = await readByID(id);
    await remove(id);
    await activity.create({
      By: { id: userID, name: username },
      action: "deleted",
      what: "supplier",
      item: { name: supplier.name, id: supplier._id },
      in: { name: supplier.name, id: supplier._id },
    });
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
  updateHandler,
  deleteHandler,
};
