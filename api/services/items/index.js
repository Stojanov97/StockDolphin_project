const express = require("express");
require("../../pkg/db");
const config = require("../../pkg/config").get;
const {
  createHandler,
  readHandler,
  updateHandler,
  moveHandler,
  deleteHandler,
  deleteByCategoryHandler,
  readActivityHandler,
  getImage,
  getLength,
} = require("./handlers");

const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const { expressjwt: jwt } = require("express-jwt");
const service = express();
const port = config("ITEMS_SERVICE_PORT");

service.use(express.json());
service.use(fileUpload());
service.use(cookieParser());
service.use(
  jwt({
    secret: config("JWT_SECRET"),
    algorithms: ["HS256"],
    getToken: function (req) {
      return req.cookies.token;
    },
  }).unless({
    path: [
      "/api/v1/items/recent",
      "/api/v1/items/length",
      /^\/api\/v1\/items\/category\/.*/,
      /^\/api\/v1\/items\/image\/.*/,
      { url: "/api/v1/items/", method: "GET" },
    ],
  })
);

service.get("/api/v1/items", readHandler);
service.get("/api/v1/items/length", getLength);
service.get("/api/v1/items/recent", readActivityHandler);
service.get("/api/v1/items/image/:id", getImage);
service.post("/api/v1/items", createHandler);
service.patch("/api/v1/items/:id", updateHandler);
service.patch("/api/v1/items/move/:id", moveHandler);
service.delete("/api/v1/items/:id", deleteHandler);
service.delete("/api/v1/items/cat/:id", deleteByCategoryHandler);

service.listen(port, (err) =>
  err ? console.log(err) : console.log("Items service started successfully")
);
