const {
  create,
  read,
  readByItemID,
  update,
  readRecent,
} = require("../../../pkg/orders");
const activity = require("../../../pkg/itemActivity");
const { readByID: itemByID } = require("../../../pkg/items");
const { OrderCreate, OrderUpdate } = require("../../../pkg/orders/validate");
const { downloadAll } = require("../../../pkg/files");
const { validate } = require("../../../pkg/validator");

const createHandler = async (req, res) => {
  try {
    const { admin, username, id } = req.auth;
    if (admin === false) throw { code: 401, error: "You aren't an admin" };
    let data = {
      supplier: {
        name: req.body.supplierName,
        id: req.body.supplier,
      },
      quantity: req.body.quantity,
      price: req.body.price,
      date: req.body.date,
      item: { name: req.body.itemName, id: req.body.item },
      By: { name: username, id: id },
    };
    await validate(data, OrderCreate);
    let item = await itemByID(req.body.item);
    await create(data);
    await activity.create({
      By: { name: username, id: id },
      action: "ordered", //za testiranje
      item: { name: req.body.itemName, id: req.body.item },
      in: item.category,
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
    const { admin, username } = req.auth;
    if (admin === false) throw { code: 401, error: "You aren't an admin" };
    const { id } = req.params;
    if (req.body.item || req.body.itemName)
      throw { code: 400, error: "You can't change the item" };
    let data = {
      supplier: {
        name: req.body.supplierName,
        id: req.body.supplier,
      },
      quantity: req.body.quantity,
      price: req.body.price,
      date: req.body.date,
      By: { name: username, id: id },
    };
    await validate(data, OrderUpdate);
    await update(id, data);
    return await res.json({ success: true });
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const recentOrdersHandler = async (req, res) => {
  try {
    let orders = await readRecent();
    return await res.json(orders);
  } catch (err) {
    throw new Error(err);
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

const getValue = async (req, res) => {
  try {
    const orders = await read();
    // console.log("orders", orders);
    const value = orders.reduce((acc, curr) => acc + curr.price, 0);
    console.log(value);
    return await res.json(value);
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
  recentOrdersHandler,
  getLength,
  getValue,
};
