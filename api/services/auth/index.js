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
} = require("./handlers");
const cookieParser = require("cookie-parser");
const service = express();
const port = config("USERS_SERVICE_PORT") || 3000;

service.use(cookieParser());
service.use(express.json());

service.post("/api/v1/auth/register", registerHandler);
service.post("/api/v1/auth/login", loginHandler);
service.post("/api/v1/auth/reset_password", requestResetPasswordHandler);
service.put("/api/v1/auth", updateCredentialsHandler);
service.patch("/api/v1/auth/:id", resetPasswordHandler);
service.delete("/api/v1/auth/:id", deleteHandler);
service.listen(port, (err) =>
  err ? console.log(err) : console.log("service started successfully")
);
