const {
  create,
  read,
  readByID,
  update,
  remove,
} = require("../../../pkg/suppliers");
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
    await create(data);
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
