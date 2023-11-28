const {
  create,
  read,
  readByUsername,
  readByEmail,
  readByID,
  update,
  changePassword,
  remove,
} = require("../../../pkg/users");
const {
  UserRegister,
  UserLogin,
  UserResetPassword,
  validate,
} = require("../../../pkg/users/validate");
const config = require("../../../pkg/config").get;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = config("JWT_SECRET");

const registerHandler = async (req, res) => {
  try {
    await validate(req.body, UserRegister);
    const { username, email } = req.body;
    if (await readByUsername(username))
      return res.status(409).send("username taken");
    if (await readByEmail(email))
      return res.status(409).send("email already in use");
    req.body.password = await bcrypt.hash(
      req.body.password,
      parseInt(config("HASHING_SALT"))
    );
    const user = await create(req.body);
    const payload = {
      username: username,
      email: email,
      id: user._id,
    };
    const token = await jwt.sign(payload, secret);
    return await res
      .cookie("token", token, { expire: 900000 + Date.now() })
      .send("created");
  } catch (err) {
    console.log(err);
    res.status(err.code).send(err);
  }
};

const loginHandler = async (req, res) => {
  try {
    await validate(req.body, UserLogin);
    const { email, password } = req.body;
    const user = await readByEmail(email);
    if (!user) {
      return res.status(404).send("user not found");
    }
    if (!(await bcrypt.compare(password, user.password)))
      return res.status(401).send("wrong password");
    const payload = {
      username: user.username,
      email: email,
      id: user._id,
    };
    const token = await jwt.sign(payload, secret);
    return await res
      .cookie("token", token, { expire: 900000 + Date.now() })
      .send("logged");
  } catch (err) {
    console.log(err);
    res.status(err.code).send(err.error);
  }
};

const updateCredentialsHandler = async (req, res) => {
  try {
    const token = jwt.verify(req.cookies.token, secret);
    if (req.body.password) return res.send("unavailable");
    await update(token.id, req.body);
    return res.status(200).send("updated");
  } catch (err) {
    console.log(err);
    res.status(err.code).send(err.error);
  }
};

const resetPasswordHandler = async (req, res) => {
  try {
    const id = req.params.id;
    await validate(req.body, UserResetPassword);
    const { newPassword, confirmNewPassword } = req.body;
    if (!newPassword || !confirmNewPassword) {
      return res.status(404).send("passwords aren't entered");
    }
    if (newPassword !== confirmNewPassword) {
      return res.status(409).send("passwords don't match");
    }
    const password = await bcrypt.hash(
      newPassword,
      parseInt(config("HASHING_SALT"))
    );
    await changePassword(id, password);
    return res.status(200).send("password changes successfully");
  } catch (err) {
    console.log(err);
    res.status(err.code).send(err.error);
  }
};

const deleteHandler = async (req, res) => {
  try {
    const id = req.params.id;
    await remove(id);
    return res.status(200).send("deleted successfully");
  } catch (err) {
    console.log(err);
    res.status(err.code).send(err.error);
  }
};

module.exports = {
  registerHandler,
  loginHandler,
  updateCredentialsHandler,
  resetPasswordHandler,
  deleteHandler,
};
