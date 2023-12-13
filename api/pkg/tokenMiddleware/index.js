const jwt = require("jsonwebtoken");
const config = require("../config").get;

async function tokenRefresher(req, res, next) {
  try {
    if (req.url == /\/api\/v1\/auth\/(login|register)/) {
      return next();
    } else {
      if (!req.cookies.token && req.cookies.refreshToken) {
        const { iat, exp, ...payload } = await jwt.verify(
          req.cookies.refreshToken,
          config("REFRESH_JWT_SECRET")
        );
        let token = await jwt.sign(payload, config("JWT_SECRET"), {
          expiresIn: "30s",
        });
        await res.cookie("token", await token, {
          expires: new Date(Date.now() + 30000),
          httpOnly: true,
        });
        return next();
      }
      if (!req.cookies.refreshToken) {
        await res.sendStatus(403);
      }
    }
  } catch (err) {
    return res.status(500 || err.code).send("Internal server error" || err);
  }
}

module.exports = {
  tokenRefresher,
};
