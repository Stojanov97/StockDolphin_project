require("dotenv").config();

let get = (section) => {
  return process.env[section] ? process.env[section] : "Non existing variable";
};

module.exports = {
  get,
};
