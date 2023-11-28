const { Validator } = require("node-input-validator");

const UserRegister = {
  name: "required|string",
  lastName: "required|string",
  email: "required|email",
  username: "required|string",
  admin: "required|boolean",
  password: "required|string",
};

const UserLogin = {
  email: "required|email",
  password: "required|string",
};

const UserResetPassword = {
  newPassword: "required|string",
  confirmNewPassword: "required|string",
};

const validate = async (data, schema) => {
  let v = new Validator(data, schema);
  let e = v.check();
  if (!e) {
    throw {
      code: 400,
      error: v.errors,
    };
  }
};

module.exports = {
  UserRegister,
  UserLogin,
  UserResetPassword,
  validate,
};
