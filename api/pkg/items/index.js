const mongoose = require("mongoose");

const ItemScheme = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
      },
      name: {
        type: String,
        required: true,
      },
    },
    By: {
      name: { type: String, required: true },
      id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "category",
      },
    },
  },
  { timestamps: true }
);

const item = mongoose.model("item", ItemScheme, "Items");

const create = async (data) => {
  try {
    let Item = new item(data);
    return await Item.save();
  } catch (err) {
    throw new Error(err);
  }
};

const read = async () => {
  try {
    return await item.find();
  } catch (err) {
    throw new Error(err);
  }
};

const readByID = async (id) => {
  try {
    return await item.findOne({ _id: id });
  } catch (err) {
    throw new Error(err);
  }
};

const readByUserID = async (id) => {
  try {
    return await item.find({ "By.id": id });
  } catch (err) {
    throw new Error(err);
  }
};

const readByCategory = async (id) => {
  try {
    console.log(await item.find({ "category.id": id }));
    return await item.find({ "category.id": id });
  } catch (err) {
    throw new Error(err);
  }
};

const update = async (id, data) => {
  try {
    return await item.updateOne({ _id: id }, data);
  } catch (err) {
    throw new Error(err);
  }
};

const remove = async (id) => {
  try {
    return await item.deleteOne({ _id: id });
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  create,
  read,
  readByID,
  readByUserID,
  readByCategory,
  update,
  remove,
};
