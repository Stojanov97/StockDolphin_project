const {
  create,
  read,
  readByUsername,
  readByEmail,
  update,
  changePassword,
  remove,
  readByID,
} = require("../../../pkg/users");
const {
  UserRegister,
  UserLogin,
  UserRequestResetPassword,
  UserResetPassword,
} = require("../../../pkg/users/validate");
const { validate } = require("../../../pkg/validator");
const config = require("../../../pkg/config").get;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = config("JWT_SECRET");
const refreshSecret = config("REFRESH_JWT_SECRET");
const {
  welcomeTemplate,
  resetTemplate,
  sendMail,
} = require("../../../pkg/mailer");

const TOKEN_EXPIRE_SECONDS = 1800000;
const TOKEN_EXPIRE_TIME = "30min";
const REFRESH_TOKEN_EXPIRE_SECONDS = 86400000;
const REFRESH_TOKEN_EXPIRE_TIME = "24h";

const registerHandler = async (req, res) => {
  try {
    await validate(req.body, UserRegister);
    const { username, email } = req.body;
    if (await readByUsername(username))
      throw {
        code: 409,
        error: "username taken",
      };
    if (await readByEmail(email))
      throw {
        code: 409,
        error: "email already in use",
      };
    if (req.body.password.length < 8)
      throw {
        code: 409,
        error: "The password must be at least 8 characters long",
      };
    console.log("made it past tests");
    req.body.password = await bcrypt.hash(
      req.body.password,
      parseInt(config("HASHING_SALT"))
    );
    console.log(req.body);
    const user = await create(req.body);
    console.log("between payload");
    const payload = {
      username: username,
      name: user.name,
      lastName: user.lastName,
      email: email,
      admin: user.admin,
      id: user._id,
    };
    console.log(payload);
    const token = await jwt.sign(payload, secret, {
      expiresIn: TOKEN_EXPIRE_TIME,
    });
    const refreshToken = await jwt.sign(payload, refreshSecret, {
      expiresIn: REFRESH_TOKEN_EXPIRE_TIME,
    });
    sendMail(email, "Welcome To Our Platform", welcomeTemplate(username));
    await res.cookie("token", token, {
      expires: new Date(Date.now() + TOKEN_EXPIRE_SECONDS),
      httpOnly: true,
      secure: true,
    });
    return await res
      .cookie("refreshToken", refreshToken, {
        expires: new Date(Date.now() + REFRESH_TOKEN_EXPIRE_SECONDS),
        httpOnly: true,
        secure: true,
      })
      .json({ success: true, userData: payload});
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const loginHandler = async (req, res) => {
  try {
    await validate(req.body, UserLogin);
    const { email, password } = req.body;
    const user = await readByEmail(email);
    if (!user)
      throw {
        code: 404,
        error: "user not found",
      };
    if (!(await bcrypt.compare(password, user.password)))
      throw {
        code: 401,
        error: "wrong password",
      };
    const payload = {
      username: user.username,
      name: user.name,
      lastName: user.lastName,
      email: email,
      admin: user.admin,
      id: user._id,
    };
    const token = await jwt.sign(payload, secret, {
      expiresIn: TOKEN_EXPIRE_TIME,
    });
    const refreshToken = await jwt.sign(payload, refreshSecret, {
      expiresIn: REFRESH_TOKEN_EXPIRE_TIME,
    });
    await res.cookie("token", token, {
      expires: new Date(Date.now() + TOKEN_EXPIRE_SECONDS),
      httpOnly: true,
      secure:true
    });
    return await res
      .cookie("refreshToken", refreshToken, {
        expires: new Date(Date.now() + REFRESH_TOKEN_EXPIRE_SECONDS),
        httpOnly: true,
        secure:true
      })
      .json({ success: true, userData: payload});
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const updateCredentialsHandler = async (req, res) => {
  try {
    const { id } = req.auth;
    if (req.body.password || req.body.admin) return res.send("unavailable");
    await update(id, req.body);
    return res.status(200).json({ success: true });
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const requestResetPasswordHandler = async (req, res) => {
  try {
    await validate(req.body, UserRequestResetPassword);
    let user = await readByEmail(req.body.email);
    sendMail(
      user.email,
      "Password Reset Email",
      resetTemplate(user.username, user._id)
    );
    return res.status(200).json({ success: true });
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
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
    const user = await readByID(id);
    if (await bcrypt.compare(newPassword, user.password)) {
      return res
        .status(400)
        .send("New password can't be the same as the old one");
    }
    const password = await bcrypt.hash(
      newPassword,
      parseInt(config("HASHING_SALT"))
    );
    await changePassword(id, password);
    return res.status(200).json({ success: true });
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const deleteHandler = async (req, res) => {
  try {
    const token = req.auth;
    if (token.admin != true) throw { code: 401, error: "You are not an admin" };
    const id = req.params.id;
    await remove(id);
    return res.status(200).json({ success: true });
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const logoutHandler = async (req, res) => {
  try {
    res.clearCookie("refreshToken");
    res.clearCookie("token");
    return res.json({ logged: false });
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const readAllHandler = async (req, res) => {
  try {
    let users = await read();
    return await res.json(users);
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const refreshToken = async (req, res) => {
  try {
    // console.log(req.cookies.token, req.cookies.refreshToken)
    if (!req.cookies.token && req.cookies.refreshToken) {
      const { iat, exp, ...payload } = jwt.verify(
        req.cookies.refreshToken,
        config("REFRESH_JWT_SECRET")
      );
      let token = jwt.sign(payload, config("JWT_SECRET"), {
        expiresIn: TOKEN_EXPIRE_TIME,
      });
      await res.cookie("token", token, {
        expires: new Date(Date.now() + TOKEN_EXPIRE_SECONDS),
        httpOnly: true,
        secure: true,
      });
      return res
        .status(200)
        .json({ success: true, msg: "Token refreshed", userData: payload});
    } else if (!req.cookies.refreshToken) {
      return res
        .status(404)
        .json({ success: false, msg: "No refreshToken found", userData: false });
    } else if (req.cookies.token) {
      console.log("already had a token");
      const { iat, exp, ...payload } = jwt.verify(
        req.cookies.refreshToken,
        config("REFRESH_JWT_SECRET")
      );
      return res.status(200).json({
        success: true,
        msg: "already had a token",
        userData: payload
      });
    }
  } catch (err) {
    return res.status(err.code || 500).json({
      success: false,
      err: err || "Internal server error",
      userData: false,
    });
  }
};

module.exports = {
  registerHandler,
  loginHandler,
  updateCredentialsHandler,
  requestResetPasswordHandler,
  resetPasswordHandler,
  deleteHandler,
  logoutHandler,
  readAllHandler,
  refreshToken,
};
