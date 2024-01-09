const express = require("express");
require("../../pkg/db");
const config = require("../../pkg/config").get;
const {
  createHandler,
  readHandler,
  readByUserHandler,
  updateHandler,
  deleteHandler,
  getImage,
} = require("./handlers");

const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const { expressjwt: jwt } = require("express-jwt");
const service = express();
const port = config("CATEGORIES_SERVICE_PORT");

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
      /^\/api\/v1\/categories\/image\/.*/,
      { url: "/api/v1/categories/", method: "GET" },
    ],
  })
);

service.get("/api/v1/categories", readHandler);
service.get("/api/v1/categories/user", readByUserHandler);
service.get("/api/v1/categories/image/:id", getImage);
service.post("/api/v1/categories", createHandler);
service.patch("/api/v1/categories/:id", updateHandler);
service.delete("/api/v1/categories/:id", deleteHandler);

service.listen(port, (err) =>
  err ? console.log(err) : console.log("Category service started successfully")
);
