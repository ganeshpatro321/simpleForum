const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Helper = {
  async verifyToken(req, res, next) {
    const authToken = req.headers["authorization"];
    if (authToken) {
      try {
        const { userId } = jwt.verify(authToken, "app");
        const user = await User.findById(userId);
        if (user) {
          req.user = user;
        }
        next();
      } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
          console.log("Unauthenticated user access!");
        } else {
          console.log("Error at init endpoint!");
        }
        res.status(401).send({
          message: "Authorization error",
        });
      }
    } else {
        res.status(401).send({
            message: "Unauthorized to access this route."
        })
    }
  },
};

module.exports = Helper;
