const path = require("path");
const proxy = require("express-http-proxy");
const express = require("express");
const config = require("../../pkg/config").get;
const app = express();

const allowCrossDomain = (req, res, next) => { // CORS middleware
  res.header(`Access-Control-Allow-Origin`, `*`);
  res.header(`Access-Control-Allow-Methods`, `GET,PUT,PATCH,POST,DELETE`);
  res.header(`Access-Control-Allow-Headers`, `Content-Type`);
  res.header(`Access-Control-Allow-Credentials`, true);
  next();
};

app.use(allowCrossDomain);
 // Proxy all requests to the services
app.use( 
  "/api/v1/auth",
  proxy(`http://127.0.0.1:${config("USERS_SERVICE_PORT")}`, {
    proxyReqPathResolver: (req) =>
      `http://127.0.0.1:${config("USERS_SERVICE_PORT")}/api/v1/auth${req.url}`,
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

app.use(
  "/api/v1/invoices",
  proxy(`http://127.0.0.1:${config("INVOICES_SERVICE_PORT")}`, {
    proxyReqPathResolver: (req) =>
      `http://127.0.0.1:${config("INVOICES_SERVICE_PORT")}/api/v1/invoices${
        req.url
      }`,
  })
);

app.use(
  "/api/v1/socket",
  proxy(`http://127.0.0.1:${config("SOCKET_SERVICE_PORT")}`, {
    proxyReqPathResolver: (req) =>
      `http://127.0.0.1:${config("SOCKET_SERVICE_PORT")}${req.url}`
  })
);
// Serve the web app
app.use("/", express.static(path.join(__dirname, "../../../web/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../../web/build", "index.html"));
});
const PORT = config("APP_PORT") || 3000;

app.listen(PORT, (err) =>
  err ? console.log(err) : console.log("Proxy started successfully")
);
