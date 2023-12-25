const path = require("path");
const proxy = require("express-http-proxy");
const express = require("express");
const config = require("../../pkg/config").get;
const { tokenRefresher } = require("../../pkg/tokenMiddleware");

const app = express();
// app.use(tokenRefresher);
app.use(
  "/api/v1/auth",
  proxy(`http://127.0.0.1:${config("USERS_SERVICE_PORT")}`, {
    proxyReqPathResolver: (req) =>
      `http://127.0.0.1:${config("USERS_SERVICE_PORT")}/api/v1/auth${req.url}`,
    limit: "35mb",
    preserveHostHdr: true,
  })
);

app.use(
  "/api/v1/category",
  proxy(`http://127.0.0.1:${config("CATEGORIES_SERVICE_PORT")}`, {
    proxyReqPathResolver: (req) =>
      `http://127.0.0.1:${config("CATEGORIES_SERVICE_PORT")}/api/v1/category${
        req.url
      }`,
    limit: "35mb",
  })
);

app.use(
  "/api/v1/item",
  proxy(`http://127.0.0.1:${config("ITEMS_SERVICE_PORT")}`, {
    proxyReqPathResolver: (req) =>
      `http://127.0.0.1:${config("ITEMS_SERVICE_PORT")}/api/v1/item${req.url}`,
    limit: "35mb",
  })
);

app.use(
  "/api/v1/order",
  proxy(`http://127.0.0.1:${config("ORDERS_SERVICE_PORT")}`, {
    proxyReqPathResolver: (req) =>
      `http://127.0.0.1:${config("ORDERS_SERVICE_PORT")}/api/v1/order${
        req.url
      }`,
  })
);

app.use(
  "/api/v1/suppliers",
  proxy(`http://127.0.0.1:${config("SUPPLIERS_SERVICE_PORT")}`, {
    proxyReqPathResolver: (req) =>
      `http://127.0.0.1:${config("SUPPLIERS_SERVICE_PORT")}/api/v1/suppliers${
        req.url
      }`,
    limit: "35mb",
  })
);

const PORT = config("APP_PORT") || 3000;

app.listen(PORT, (err) =>
  err ? console.log(err) : console.log("Proxy started successfully")
);
