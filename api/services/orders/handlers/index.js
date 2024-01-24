const {
  create,
  read,
  readByID,
  readByItemID,
  update,
  readRecent,
  removeByCategory,
  removeByItem,
} = require("../../../pkg/orders");
const activity = require("../../../pkg/activity");
const { OrderCreate} = require("../../../pkg/orders/validate");
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

const deleteByCategoryHandler = async (req, res) => {
  try {
    const {admin} = req.auth;
    if (admin === false) throw { code: 401, error: "You aren't an admin" };
    const { id } = req.params;
    await removeByCategory(id);
    return await res.json({ success: true });
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
}

const deleteByItemHandler = async (req, res) => {
  try {
    const {admin} = req.auth;
    if (admin === false) throw { code: 401, error: "You aren't an admin" };
    const { id } = req.params;
    await removeByItem(id);
    return await res.json({ success: true });
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
}

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
  recentOrdersHandler,
  getLength,
  getValue,
  deleteByCategoryHandler,
  deleteByItemHandler
};
