const express = require("express");
require("../../pkg/db");
const {
  create,
  read,
  readByID,
  readByUserID,
  update,
  remove,
} = require("../../pkg/categories");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const api = express();
const port = 3000;

const {
  upload,
  downloadOne,
  downloadAll,
  removeFile,
} = require("../../pkg/files");

api.use(express.json());
api.use(fileUpload());
api.use(cookieParser());

api.get("/api/v1/cat", async (req, res) => {
  try {
    // let category = await read();
    // return res.send(...category, ...{ photo: await downloadOne("cat", id) });
    let result = await downloadAll("cat");
    return res.send(result);
  } catch (err) {
    console.log(err);
    return res
      .status(500 || err.code)
      .send("Internal server error" || err.error);
  }
});

api.get("/api/v1/cat/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let category = await readByID(id);
    return res.send(category);
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
