const mongoose = require("mongoose");

const OrderScheme = new mongoose.Schema(
  {
    supplier: {
      name: { type: String, required: true },
      id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "supplier",
      },
    },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    date: { type: Date, required: true },
    item: {
      name: { type: String, required: true },
      id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "item",
      },
    },
    category: {
      name: { type: String, required: true },
      id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "category",
      },
    },
    By: {
      name: { type: String, required: true },
      id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
      },
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

const readByID = async (id) => {
  try {
    return await order.findOne({ _id: id });
  } catch (err) {
    throw new Error(err);
  }
};

const readByItemID = async (id) => {
  try {
    return await order.find({ "item.id": id });
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

const readRecent = async () => {
  try {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    return await order.find({ updatedAt: { $gt: threeDaysAgo } });
  } catch (err) {
    throw new Error(err);
  }
};

const removeByCategory = async (id) => {
  try {
    return await order.deleteMany({ "category.id": id });
  } catch (err) {
    throw new Error(err);
  }
};

const removeByItem = async (id) => {
  try {
    return await order.deleteMany({ "item.id": id });
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  create,
  read,
  readByID,
  readByItemID,
  update,
  readRecent,
  removeByCategory,
  removeByItem,
};
