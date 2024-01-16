const {
  create,
  read,
  readByID,
  readByItemID,
  update,
  readRecent,
} = require("../../../pkg/orders");
const activity = require("../../../pkg/activity");
const { readByID: itemByID } = require("../../../pkg/items");
const { OrderCreate, OrderUpdate } = require("../../../pkg/orders/validate");
const { downloadAll } = require("../../../pkg/files");
const { validate } = require("../../../pkg/validator");

const createHandler = async (req, res) => {
  try {
    const { admin, username, id } = req.auth;
    if (admin === false) throw { code: 401, error: "You aren't an admin" };
    console.log(req.body);
    let data = {
      ...req.body,
      By: { name: username, id: id },
    };
    await validate(data, OrderCreate);
    await create(data);
    console.log("tuka");
    await activity.create({
      By: { name: username, id: id },
      action: "ordered",
      what: "order",
      item: req.body.item,
      in: req.body.category,
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
    let test = await readByItemID(req.params.item);
    let value = test.reduce((acc, curr) => acc + curr.price, 0);
    return await res.json(value);
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
    if (
      req.body.item ||
      req.body.itemName ||
      req.body.categoryName ||
      req.body.category
    )
      throw { code: 400, error: "You can't change the item" };
    let data = {
      supplier: {
        name: req.body.supplierName,
        id: req.body.supplier,
      },
      quantity: req.body.quantity,
      price: req.body.price,
      date: req.body.date,
      By: { name: username, id: userID },
    };
    await validate(data, OrderUpdate);
    await update(id, data);
    let order = await readByID(id);
    let item = await itemByID(order.item.id);
    await activity.create({
      By: { name: username, id: userID },
      action: "edited",
      what: "order",
      item: { name: order.item.name, id: order.item.id },
      in: item.category,
    });
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
