const jwt = require("jsonwebtoken");
const config = require("../config").get;

async function tokenRefresher(req, res, next) {
  try {
    if (!req.cookies.token && req.cookies.refreshToken) {
      const { iat, exp, ...payload } = jwt.verify(
        req.cookies.refreshToken,
        config("REFRESH_JWT_SECRET")
      );
      let token = jwt.sign(payload, config("JWT_SECRET"), {
        expiresIn: "30s",
      });
      req.refreshAccessToken = token;
      await res.cookie("token", token, {
        expires: new Date(Date.now() + 30000),
        httpOnly: true,
      });
    }
    return next();
  } catch (err) {
    return res.status(500 || err.code).send("Internal server error" || err);
  }
}

module.exports = {
  tokenRefresher,
};
