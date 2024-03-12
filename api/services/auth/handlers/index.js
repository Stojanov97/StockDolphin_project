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
    await validate(req.body, UserRegister); // Validate the request body
    const { username, email } = req.body;
    if (await readByUsername(username)) // Check if the username is already taken
      throw {
        code: 409,
        error: "username taken",
      };
    if (await readByEmail(email)) // Check if the email is already in use
      throw {
        code: 409,
        error: "email already in use",
      };
    if (req.body.password.length < 8) // Check if the password is at least 8 characters long
      throw {
        code: 409,
        error: "The password must be at least 8 characters long",
      };
    req.body.password = await bcrypt.hash( // Hash the password
      req.body.password,
      parseInt(config("HASHING_SALT"))
    );
    const user = await create(req.body); // Create the user in DB
    const payload = { // Create the payload for the JWT
      username: username,
      name: user.name,
      lastName: user.lastName,
      email: email,
      admin: user.admin,
      id: user._id,
    };
    const token = await jwt.sign(payload, secret, { // Create the JWT
      expiresIn: TOKEN_EXPIRE_TIME,
    });
    const refreshToken = await jwt.sign(payload, refreshSecret, { // Create the refresh token
      expiresIn: REFRESH_TOKEN_EXPIRE_TIME,
    });
    sendMail(email, "Welcome To Our Platform", welcomeTemplate(username)); // Send the welcome email
    await res.cookie("token", token, { // Set the JWT as a cookie
      expires: new Date(Date.now() + TOKEN_EXPIRE_SECONDS),
      httpOnly: true,
      secure: true,
    });
    return await res
      .cookie("refreshToken", refreshToken, { // Set the refresh token as a cookie
        expires: new Date(Date.now() + REFRESH_TOKEN_EXPIRE_SECONDS),
        httpOnly: true,
        secure: true,
      })
      .json({ success: true, userData: payload}); // Return the user payload
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const loginHandler = async (req, res) => {
  try {
    await validate(req.body, UserLogin); // Validate the request body
    const { email, password } = req.body;
    const user = await readByEmail(email); // Find the user by email
    if (!user) // If the user is not found, throw an error
      throw {
        code: 404,
        error: "user not found",
      };
    if (!(await bcrypt.compare(password, user.password))) // If the password is wrong, throw an error
      throw {
        code: 401,
        error: "wrong password",
      };
    const payload = { // Create the payload for the JWT
      username: user.username,
      name: user.name,
      lastName: user.lastName,
      email: email,
      admin: user.admin,
      id: user._id,
    };
    const token = await jwt.sign(payload, secret, { // Create the JWT
      expiresIn: TOKEN_EXPIRE_TIME,
    });
    const refreshToken = await jwt.sign(payload, refreshSecret, { // Create the refresh token
      expiresIn: REFRESH_TOKEN_EXPIRE_TIME,
    });
    await res.cookie("token", token, { // Set the JWT as a cookie
      expires: new Date(Date.now() + TOKEN_EXPIRE_SECONDS),
      httpOnly: true,
      secure:true
    });
    return await res
      .cookie("refreshToken", refreshToken, { // Set the refresh token as a cookie
        expires: new Date(Date.now() + REFRESH_TOKEN_EXPIRE_SECONDS),
        httpOnly: true,
        secure:true
      })
      .json({ success: true, userData: payload}); // Return the user payload
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const updateCredentialsHandler = async (req, res) => {
  try {
    const { id } = req.auth;
    if (req.body.password || req.body.admin) return res.send("unavailable"); // Check if the request body contains the password or admin fields
    await update(id, req.body); // Update the user
    return res.status(200).json({ success: true }); // Return success
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const requestResetPasswordHandler = async (req, res) => {
  try {
    await validate(req.body, UserRequestResetPassword); // Validate the request body
    let user = await readByEmail(req.body.email); // Find the user by email
    sendMail( // Send the reset password email
      user.email,
      "Password Reset Email",
      resetTemplate(user.username, user._id)
    );
    return res.status(200).json({ success: true }); // Return success
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const resetPasswordHandler = async (req, res) => {
  try {
    const id = req.params.id;
    await validate(req.body, UserResetPassword); // Validate the request body
    const { newPassword, confirmNewPassword } = req.body;
    if (!newPassword || !confirmNewPassword) { // Check if the new password and confirm new password are entered
      return res.status(404).send("passwords aren't entered");
    }
    if (newPassword !== confirmNewPassword) {
      return res.status(409).send("passwords don't match");
    }
    const user = await readByID(id); // Find the user by id
    if (await bcrypt.compare(newPassword, user.password)) { // Check if the new password is the same as the old one
      return res 
        .status(400)
        .send("New password can't be the same as the old one");
    }
    const password = await bcrypt.hash( // Hash the new password
      newPassword,
      parseInt(config("HASHING_SALT"))
    );
    await changePassword(id, password); // Change the password in the DB
    return res.status(200).json({ success: true }); // Return success
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const deleteHandler = async (req, res) => {
  try {
    const token = req.auth;
    if (token.admin != true) throw { code: 401, error: "You are not an admin" }; // Check if the user is an admin
    const id = req.params.id;
    await remove(id); // Remove the user from the DB
    return res.status(200).json({ success: true }); // Return success
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const logoutHandler = async (req, res) => {
  try {
    res.clearCookie("refreshToken"); // Clear the refresh token cookie
    res.clearCookie("token"); // Clear the JWT cookie
    return res.json({ logged: false }); // Return success, the user is logged out
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
    if (!req.cookies.token && req.cookies.refreshToken) { // Check if the token is expired and the refresh token is present
      const { iat, exp, ...payload } = jwt.verify( // Destructuring the payload from the refresh token
        req.cookies.refreshToken,
        config("REFRESH_JWT_SECRET")
      );
      let token = jwt.sign(payload, config("JWT_SECRET"), { // Create a new token
        expiresIn: TOKEN_EXPIRE_TIME,
      });
      await res.cookie("token", token, { // Set the new token as a cookie
        expires: new Date(Date.now() + TOKEN_EXPIRE_SECONDS),
        httpOnly: true,
        secure: true,
      });
      return res
        .status(200)
        .json({ success: true, msg: "Token refreshed", userData: payload}); // Return success
    } else if (!req.cookies.refreshToken) {
      return res
        .status(404)
        .json({ success: false, msg: "No refreshToken found", userData: false }); // Return no refresh token found
      } else if (req.cookies.token) {
        const { iat, exp, ...payload } = jwt.verify( // Check if the token is valid
        req.cookies.token,
        config("JWT_SECRET"),
        );
        return res.status(200).json({ // Return the payload
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
