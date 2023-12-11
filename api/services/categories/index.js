const express = require("express");
require("../../pkg/db");
const {
  create,
  read,
  readByUserID,
  update,
  remove,
} = require("../../pkg/categories");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const api = express();
const port = 3000;

const { upload, download } = require("../../pkg/files");

api.use(express.json());
api.use(express.urlencoded({ extended: true }));
api.use(fileUpload());
api.use(cookieParser());

api.get("/api/v1/cat/:id", async (req, res) => {
  try {
    const { id } = req.url;
    return res.download(await download("cat", id));
  } catch (err) {
    console.log(err);
    return res
      .status(500 || err.code)
      .send("Internal server error" || err.error);
  }
});

api.post("/api/v1/cat", async (req, res) => {
  try {
    let category = await create(req.body);
    await upload(req.files.photo, "cat", category._id);
    return res.status(200).send("success");
  } catch (err) {
    return res
      .status(500 || err.code)
      .send("Internal server error" || err.error);
  }
});

api.listen(port, () => console.log(`Example app listening on port ${port}!`));
