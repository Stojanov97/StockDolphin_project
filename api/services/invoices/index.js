const express = require("express");
require("../../pkg/db");
const config = require("../../pkg/config").get;
const { createHandler, readHandler, moveHandler } = require("./handlers");
const service = express();
const port = config("INVOICES_SERVICE_PORT");
const cookieParser = require("cookie-parser");
const { expressjwt: jwt } = require("express-jwt");

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
    path: [{ url: "/api/v1/invoices/", method: "GET" }],
  })
);

service.get("/api/v1/invoices", readHandler);
service.post("/api/v1/invoices", createHandler);
service.put("/api/v1/invoices/:id", moveHandler);
service.listen(port, () =>
  console.log("Invoices service started successfully")
);
