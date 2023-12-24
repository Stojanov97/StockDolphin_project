const path = require("path");
const { create, read, readByItemID, update } = require("../../../pkg/orders");
const { OrderCreate, OrderUpdate } = require("../../../pkg/orders/validate");
const { validate } = require("../../../pkg/validator");

const createHandler = async (req, res) => {
  try {
    let userID = req.auth.id;
    if (req.auth.admin === false)
      throw { code: 401, error: "You aren't an admin" };
    let data = {
      ...req.body,
      ...{ By: userID },
    };
    await validate(data, OrderCreate);
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

const readByItemHandler = async (req, res) => {
  try {
    return res.json(await readByItemID(req.params.item));
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
    if (req.body.item) throw { code: 400, error: "You can't change the item" };
    await validate(req.body, OrderUpdate);
    await update(id, req.body);
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
  readByItemHandler,
  updateHandler,
};
