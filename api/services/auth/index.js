const express = require("express");
require("../../pkg/db");
const config = require("../../pkg/config").get;
const {
  registerHandler,
  loginHandler,
  updateCredentialsHandler,
  requestResetPasswordHandler,
  resetPasswordHandler,
  deleteHandler,
  logoutHandler,
  readAllHandler,
} = require("./handlers");
const { tokenRefresher } = require("../../pkg/tokenMiddleware");
const { expressjwt: jwt } = require("express-jwt");
const cookieParser = require("cookie-parser");
const service = express();
const port = config("USERS_SERVICE_PORT") || 3000;

service.use(cookieParser());
service.use(express.json());
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
    path: [
      "/api/v1/auth/register",
      "/api/v1/auth/login",
      { url: "/api/v1/auth/", methods: ["GET", "POST"] },
      { url: /^\/api\/v1\/auth\/.*/, method: "PATCH" },
    ],
  })
);

service.get("/api/v1/auth", readAllHandler);
service.post("/api/v1/auth/register", registerHandler);
service.post("/api/v1/auth/login", loginHandler);
service.post("/api/v1/auth", requestResetPasswordHandler);
service.patch("/api/v1/auth/:id", resetPasswordHandler);
service.put("/api/v1/auth", updateCredentialsHandler);
service.delete("/api/v1/auth/:id", deleteHandler);
service.delete("/api/v1/auth", logoutHandler);

service.listen(port, (err) =>
  err ? console.log(err) : console.log("Auth service started successfully")
);
