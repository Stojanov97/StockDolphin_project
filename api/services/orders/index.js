const express = require("express");
require("../../pkg/db");
const config = require("../../pkg/config").get;
const {
  createHandler,
  readHandler,
  readByItemHandler,
  updateHandler,
} = require("./handlers");

const cookieParser = require("cookie-parser");
const { expressjwt: jwt } = require("express-jwt");
const service = express();
const port = config("ORDERS_SERVICE_PORT");

service.use(express.json());
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
      { url: "/api/v1/orders/", method: "GET" },
      { url: /^\/api\/v1\/orders\/.*/, method: "GET" },
    ],
  })
);

service.get("/api/v1/orders", readHandler);
service.get("/api/v1/orders/:item", readByItemHandler);
service.post("/api/v1/orders", createHandler);
service.patch("/api/v1/orders/:id", updateHandler);

service.listen(port, (err) =>
  err ? console.log(err) : console.log("Orders service started successfully")
);
