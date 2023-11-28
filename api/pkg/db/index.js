const mongoose = require("mongoose");
const config = require("../config").get;

const username = config("MONGO_USERNAME");
const password = config("MONGO_PASSWORD");
const cluster = config("MONGO_CLUSTER");
const database = config("MONGO_DATABASE");

const uri = `mongodb+srv://${username}:${password}@${cluster}/${database}?retryWrites=true&w=majority`;

(async () => {
  try {
    await mongoose.connect(uri);
    console.log("Mongo DB connected");
  } catch (err) {
    throw new Error(err);
  }
})();
