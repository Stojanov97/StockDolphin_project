const express = require("express");
require("../../pkg/db");
const config = require("../../pkg/config").get;
const {
  createHandler,
  readHandler,
  readByItemHandler,
  updateHandler,
  recentOrdersHandler,
  getLength,
  getValue,
  deleteByItemHandler,
  deleteByCategoryHandler
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
      "/api/v1/orders/length",
      { url: "/api/v1/orders/", method: "GET" },
      { url: /^\/api\/v1\/orders\/.*/, method: "GET" },
    ],
  })
);

service.get("/api/v1/orders", readHandler);
service.get("/api/v1/orders/recent", recentOrdersHandler);
service.get("/api/v1/orders/length", getLength);
service.get("/api/v1/orders/total", getValue);
service.get("/api/v1/orders/:item", readByItemHandler);
service.post("/api/v1/orders", createHandler);
service.delete("/api/v1/orders/cat/:id", deleteByCategoryHandler);
service.delete("/api/v1/orders/item/:id", deleteByItemHandler);

service.listen(port, (err) =>
  err ? console.log(err) : console.log("Orders service started successfully")
);
