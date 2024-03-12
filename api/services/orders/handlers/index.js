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
    if (admin === false) throw { code: 401, error: "You aren't an admin" }; // Check if user is admin
    let data = { // Add user info and category to the data
      ...req.body,
      By: { name: username, id: id },
    };
    await validate(data, OrderCreate); // Validate the data
    await create(data); // Create the item
    await activity.create({ // Log the activity
      By: { name: username, id: id },
      action: "ordered",
      what: "order",
      item: req.body.item,
      in: req.body.category,
    });
    return await res.json({ success: true }); // Return success
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const readHandler = async (req, res) => {
  try {
    return await res.json(await read()); // Get all items and return them
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const readByItemHandler = async (req, res) => {
  try {
    let orders = await readByItemID(req.params.item); // Get all orders from the item
    let value = orders.reduce((acc, curr) => acc + curr.price, 0); // Get the total value of the orders
    return await res.json(value); // Return the value
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const deleteByCategoryHandler = async (req, res) => {
  try {
    const {admin} = req.auth;
    if (admin === false) throw { code: 401, error: "You aren't an admin" }; // Check if user is admin
    const { id } = req.params;
    await removeByCategory(id); // Remove all orders from the category
    return await res.json({ success: true }); // Return success
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
}

const deleteByItemHandler = async (req, res) => {
  try {
    const {admin} = req.auth;
    if (admin === false) throw { code: 401, error: "You aren't an admin" }; // Check if user is admin
    const { id } = req.params;
    await removeByItem(id); // Remove all orders from the item
    return await res.json({ success: true }); // Return success
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
}

const recentOrdersHandler = async (req, res) => {
  try {
    let orders = await readRecent(); // Get all recent orders
    return await res.json(orders); // Return the orders
  } catch (err) {
    throw new Error(err);
  }
};

const getLength = async (req, res) => {
  try {
    return res.json((await read()).length); // Get the length of all items and return it
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const getValue = async (req, res) => {
  try {
    const orders = await read(); // Get all orders
    const value = orders.reduce((acc, curr) => acc + curr.price, 0); // Get the total value of all orders
    return await res.json(value); // Return the value
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
