const proxy = require("express-http-proxy");
const express = require("express");
const config = require("../../pkg/config").get;

const app = express();

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
  "/api/v1/categories",
  proxy(`http://127.0.0.1:${config("CATEGORIES_SERVICE_PORT")}`, {
    proxyReqPathResolver: (req) =>
      `http://127.0.0.1:${config("CATEGORIES_SERVICE_PORT")}/api/v1/categories${
        req.url
      }`,
    limit: "35mb",
  })
);

app.use(
  "/api/v1/items",
  proxy(`http://127.0.0.1:${config("ITEMS_SERVICE_PORT")}`, {
    proxyReqPathResolver: (req) =>
      `http://127.0.0.1:${config("ITEMS_SERVICE_PORT")}/api/v1/items${req.url}`,
    limit: "35mb",
  })
);

app.use(
  "/api/v1/orders",
  proxy(`http://127.0.0.1:${config("ORDERS_SERVICE_PORT")}`, {
    proxyReqPathResolver: (req) =>
      `http://127.0.0.1:${config("ORDERS_SERVICE_PORT")}/api/v1/orders${
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
  })
);

const PORT = config("APP_PORT") || 3000;

app.listen(PORT, (err) =>
  err ? console.log(err) : console.log("Proxy started successfully")
);
