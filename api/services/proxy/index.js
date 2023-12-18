const path = require("path");
const proxy = require("express-http-proxy");
const express = require("express");
const config = require("../../pkg/config").get;

const app = express();

app.use(
  "/api/v1/auth",
  proxy(`http://127.0.0.1:${config("USERS_SERVICE_PORT")}`, {
    proxyReqPathResolver: (req) =>
      `http://127.0.0.1:${config("USERS_SERVICE_PORT")}/api/v1/auth${req.url}`,
  })
);

app.use(
  "/api/v1/category",
  proxy(`http://127.0.0.1:${config("CATEGORIES_SERVICE_PORT")}`, {
    proxyReqPathResolver: (req) =>
      `http://127.0.0.1:${config("CATEGORIES_SERVICE_PORT")}/api/v1/category${
        req.url
      }`,
  })
);

const PORT = config("APP_PORT") || 3000;

app.listen(PORT, (err) =>
  err ? console.log(err) : console.log("Proxy started successfully")
);
