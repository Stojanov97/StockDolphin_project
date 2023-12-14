const jwt = require("jsonwebtoken");
const config = require("../config").get;

const tokenPromise = (res, token) => {
  return new Promise((resolve, reject) => {
    res.cookie(
      "token",
      token,
      {
        expires: new Date(Date.now() + 30000),
        httpOnly: true,
      },
      (err, success) => {
        if (err) reject(err);
        else resolve(success);
      }
    );
  });
};

// async function tokenRefresher(req, res, next) {
//   if (req.url == "/api/v1/auth/login") {
//     return next();
//   } else if (req.url == "/api/v1/auth/register") {
//     return next();
//   }
// else if (req.url == "/api/v1/auth") {
//   if (req.method == "POST") {
//     return next();
//   } else if ((req.method = "DELETE")) {
//     return next();
//   } else return next();
// }
//   else {
//     if (!req.cookies.token && req.cookies.refreshToken) {
//       const { iat, exp, ...payload } = jwt.verify(
//         req.cookies.refreshToken,
//         config("REFRESH_JWT_SECRET")
//       );
//       let token = jwt.sign(payload, config("JWT_SECRET"), { expiresIn: "30s" });
//       await tokenPromise(res, token);
//       return next();
//     }
//     return next();
//   }
// }

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
      req.testingTeory = token;
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
