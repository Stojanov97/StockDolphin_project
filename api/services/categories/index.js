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

const { upload, download } = require("../../pkg/files");

api.use(express.json());
api.use(express.urlencoded({ extended: true }));
api.use(fileUpload());

api.post("/", async (req, res) => {
  try {
    // let category = await create(req.body);
    // await upload(req.files.photo, "categories", category._id);
    // return res.status(200).send("success");
    await download("categories", "6576405b013b6764a3590f72");
  } catch (err) {
    console.log(err);
    return res
      .status(500 || err.code)
      .send("Internal server error" || err.error);
  }
});

api.listen(port, () => console.log(`Example app listening on port ${port}!`));
