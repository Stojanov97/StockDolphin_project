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
    let userID = req.auth.id;
    if (req.auth.admin === false)
      throw { code: 401, error: "You aren't an admin" };
    let data = { ...req.body, ...{ By: userID } };
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
    if (req.auth.admin === false)
      throw { code: 401, error: "You aren't an admin" };
    const { id } = req.params;
    await validate(req.body, SupplierUpdate);
    await update(id, req.body);
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
    await remove(req.params.id);
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
