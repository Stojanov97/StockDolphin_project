const mongoose = require("mongoose");

const SupplierScheme = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: Number, required: true },
    email: { type: String, required: true, lowercase: true },
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

const supplier = mongoose.model("supplier", SupplierScheme, "Suppliers");

const create = async (data) => {
  try {
    let Supplier = new supplier(data);
    return await Supplier.save();
  } catch (err) {
    throw new Error(err);
  }
};

const read = async () => {
  try {
    return await supplier.find();
  } catch (err) {
    throw new Error(err);
  }
};

const readByID = async (id) => {
  try {
    return await supplier.findOne({ _id: id });
  } catch (err) {
    throw new Error(err);
  }
};

const update = async (id, data) => {
  try {
    return await supplier.updateOne({ _id: id }, data);
  } catch (err) {
    throw new Error(err);
  }
};

const remove = async (id) => {
  try {
    return await supplier.deleteOne({ _id: id });
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  create,
  read,
  readByID,
  update,
  remove,
};
