const express = require("express");
require("../../pkg/db");
const config = require("../../pkg/config").get;
const {
  createHandler,
  readHandler,
  readByUserHandler,
  updateHandler,
  deleteHandler,
} = require("./handlers");

const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const { tokenRefresher } = require("../../pkg/tokenMiddleware");
const { expressjwt: jwt } = require("express-jwt");
const service = express();
const port = config("CATEGORIES_SERVICE_PORT");

service.use(express.json());
service.use(fileUpload());
service.use(cookieParser());
service.use(tokenRefresher);
service.use(
  jwt({
    secret: config("JWT_SECRET"),
    algorithms: ["HS256"],
    getToken: function (req) {
      let token = req.cookies.token || req.refreshAccessToken;
      return token ? token : null;
    },
  }).unless({
    path: [{ url: "/api/v1/categories/", method: "GET" }],
  })
);

service.get("/api/v1/categories", readHandler);
service.get("/api/v1/categories/user", readByUserHandler);
service.post("/api/v1/categories", createHandler);
service.patch("/api/v1/categories/:id", updateHandler);
service.delete("/api/v1/categories/:id", deleteHandler);

service.listen(port, (err) =>
  err ? console.log(err) : console.log("Category service started successfully")
);
