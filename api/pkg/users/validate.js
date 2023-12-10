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

const UserRequestResetPassword = {
  email: "required|email",
};

const UserResetPassword = {
  newPassword: "required|string",
  confirmNewPassword: "required|string",
};

module.exports = {
  UserRegister,
  UserLogin,
  UserRequestResetPassword,
  UserResetPassword,
};
