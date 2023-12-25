const express = require("express");
require("../../pkg/db");
const config = require("../../pkg/config").get;
const {
  createHandler,
  readHandler,
  updateHandler,
  deleteHandler,
} = require("./handlers");

const cookieParser = require("cookie-parser");
const { tokenRefresher } = require("../../pkg/tokenMiddleware");
const { expressjwt: jwt } = require("express-jwt");
const service = express();
const port = config("SUPPLIERS_SERVICE_PORT");

service.use(express.json());
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
    path: [{ url: "/api/v1/suppliers/", method: "GET" }],
  })
);

service.get("/api/v1/suppliers", readHandler);
service.post("/api/v1/suppliers", createHandler);
service.patch("/api/v1/suppliers/:id", updateHandler);
service.delete("/api/v1/suppliers/:id", deleteHandler);

service.listen(port, (err) =>
  err ? console.log(err) : console.log("Supplier service started successfully")
);
