const mongoose = require("mongoose");

const CategoryScheme = new mongoose.Schema({
  name: { type: String, required: true },
  By: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
});

const category = mongoose.model("category", CategoryScheme, "Categories");

const create = async (data) => {
  try {
    let Category = new category(data);
    return await Category.save();
  } catch (err) {
    throw new Error(err);
  }
};

const read = async () => {
  try {
    return await category.find();
  } catch (err) {
    throw new Error(err);
  }
};

const readByUserID = async (id) => {
  try {
    return await category.findOne({ By: id });
  } catch (err) {
    throw new Error(err);
  }
};

const update = async (id, data) => {
  try {
    return await category.updateOne({ _id: id }, data);
  } catch (err) {
    throw new Error(err);
  }
};

const remove = async (id) => {
  try {
    return await category.deleteOne({ _id: id });
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
