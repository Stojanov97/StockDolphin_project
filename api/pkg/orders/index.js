const mongoose = require("mongoose");

const OrderScheme = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "item",
    },
    By: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const order = mongoose.model("order", OrderScheme, "Orders");

const create = async (data) => {
  try {
    let Order = new order(data);
    return await Order.save();
  } catch (err) {
    throw new Error(err);
  }
};

const read = async () => {
  try {
    return await order.find();
  } catch (err) {
    throw new Error(err);
  }
};

const readByUserID = async (id) => {
  try {
    return await order.find({ By: id });
  } catch (err) {
    throw new Error(err);
  }
};

const update = async (id, data) => {
  try {
    return await order.updateOne({ _id: id }, data);
  } catch (err) {
    throw new Error(err);
  }
};

const remove = async (id) => {
  try {
    return await order.deleteOne({ _id: id });
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  create,
  read,
  readByUserID,
  update,
  remove,
};
