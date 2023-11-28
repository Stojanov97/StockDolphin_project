const mongoose = require("mongoose");

const UserScheme = new mongoose.Schema(
  {
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true },
    admin: { type: Boolean, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserScheme, "Users");

const create = async (credentials) => {
  try {
    const user = new User(credentials);
    return await user.save();
  } catch (err) {
    throw new Error(err);
  }
};

const read = async () => {
  try {
    return await User.find();
  } catch (err) {
    throw new Error(err);
  }
};

const readByID = async (ID) => {
  try {
    return await User.findOne({ _id: ID });
  } catch (err) {
    throw new Error(err);
  }
};

const readByUsername = async (username) => {
  try {
    return await User.findOne({ username: username });
  } catch (err) {
    throw new Error(err);
  }
};

const readByEmail = async (email) => {
  try {
    return await User.findOne({ email: email });
  } catch (err) {
    throw new Error(err);
  }
};

const update = async (ID, data) => {
  try {
    return await User.updateOne({ _id: ID }, data);
  } catch (err) {
    throw new Error(err);
  }
};

const changePassword = async (ID, newPassword) => {
  try {
    return await User.updateOne({ _id: ID }, { password: newPassword });
  } catch (err) {
    throw new Error(err);
  }
};

const remove = async (ID) => {
  try {
    return await User.deleteOne({ _id: ID });
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  create,
  read,
  readByUsername,
  readByEmail,
  readByID,
  update,
  changePassword,
  remove,
};
