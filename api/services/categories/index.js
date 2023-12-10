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
const fileUpload = require("express-fileupload");
const api = express();
const port = 3000;

const { upload } = require("../../pkg/files");

api.use(express.json());
api.use(express.urlencoded({ extended: true }));
api.use(fileUpload());

api.post("/", async (req, res) => {
  try {
    let category = await create(req.body);
    await upload(req.files.photo, "asdfasd");
    // req.body.photo = await imageToBase64(req.body.photo);
    // console.log();
    // await create(req.body);
    return res.status(200).send("success");
  } catch (err) {
    console.log(err);
    return res
      .status(500 || err.code)
      .send("Internal server error" || err.error);
  }
});

api.listen(port, () => console.log(`Example app listening on port ${port}!`));
