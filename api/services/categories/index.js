const express = require("express");
require("../../pkg/db");
const {
  create,
  read,
  readByUserID,
  update,
  remove,
} = require("../../pkg/categories");
const imageToBase64 = require("image-to-base64");
const api = express();
const port = 3000;

api.use(express.json());
api.use(express.urlencoded({ extended: true }));

api.post("/", async (req, res) => {
  try {
    // req.body.photo = await imageToBase64(req.body.photo);
    console.log(req.body);
    // await create(req.body);
    return res.status(200).send("success");
  } catch (err) {
    throw new Error(err);
  }
});

api.listen(port, () => console.log(`Example app listening on port ${port}!`));
