const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  supplier: {
    name: { type: String, required: true },
    id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "supplier",
    },
  },
  date: { type: Date, required: true },
  orders: [
    {
      id: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "order",
      },
      price: { type: Number, required: true },
    },
  ],
  item: {
    name: { type: String, required: true },
    id: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: "item" },
  },
  category: {
    name: { type: String, required: true },
    id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "category",
    },
  },
  total: {
    type: Number,
    required: true,
  },
});

const invoice = mongoose.model("invoice", InvoiceSchema, "Invoices");

const create = async (data) => {
  try {
    let Invoice = new invoice(data);
    return await Invoice.save();
  } catch (err) {
    throw new Error(err);
  }
};

const read = async () => {
  try {
    return await invoice.find();
  } catch (err) {
    throw new Error(err);
  }
};

const move = async (id, data) => {
  try {
    return await invoice.updateMany({ "item.id": id }, data);
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  create,
  read,
  move,
};
