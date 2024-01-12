const mongoose = require("mongoose");

const ItemActivityScheme = new mongoose.Schema(
  {
    By: {
      name: { type: String, required: true },
      id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
      },
    },
    action: {
      type: String,
      required: true,
    },
    what: {
      type: String,
      required: true,
    },
    item: {
      name: {
        type: String,
        required: true,
      },
      id: {
        type: mongoose.SchemaTypes.ObjectId,
      },
    },
    in: {
      name: {
        type: String,
      },
      id: {
        type: mongoose.SchemaTypes.ObjectId,
      },
    },
  },
  { timestamps: true }
);

const itemActivity = mongoose.model(
  "itemActivity",
  ItemActivityScheme,
  "Activity"
);

const create = async (data) => {
  try {
    let ItemActivity = new itemActivity(data);
    return await ItemActivity.save();
  } catch (err) {
    throw new Error(err);
  }
};

const read = async () => {
  try {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    return await itemActivity.find({ updatedAt: { $gte: threeDaysAgo } });
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  create,
  read,
};
