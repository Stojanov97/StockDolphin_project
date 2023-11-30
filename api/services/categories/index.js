const express = require("express");
require("../../pkg/db");
const {
  create,
  read,
  readByUserID,
  update,
  remove,
} = require("../../pkg/categories");
const api = express();
const port = 3000;

api.post("/", async (req, res) => {
  try {
    await create(req.body);
    return res.status(200).send("success");
  } catch (err) {
    throw new Error(err);
  }
});

api.listen(port, () => console.log(`Example app listening on port ${port}!`));
