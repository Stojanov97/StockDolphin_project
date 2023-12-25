const mongoose = require("mongoose");

const OrderScheme = new mongoose.Schema(
  {
    supplier: { type: String, required: true },
    supplierId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "supplier",
    },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    date: { type: Date, required: true },
    item: {
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

const readByItemID = async (id) => {
  try {
    return await order.find({ item: id });
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

module.exports = {
  create,
  read,
  readByItemID,
  update,
};
