const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
// const Employee = require("../models/employee");
const User = require("../models/User");
const logger = require("./logger");
const passport = require("passport");
require("dotenv").config();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET,
  passReqToCallback: true,
};

passport.use(
  new JwtStrategy(opts, async (req, jwt_payload, done) => {
    try {
      console.log();

      const user = await User.findById(jwt_payload._id).select("-password");

      // console.log(user);

      if (!user) {
        logger.error({
          data: {
            status: 500,
            traceToken: req.traceToken,
            apiAction: "JWT_USER_VERFICATION",
            apiEndpoint: req.originalUrl,
            method: req.method,
            mess: "USER INCORRECT OR DOESN'T EXIST IN THE SYSTEM",
          },
        });
        return done(null, false);
      }

      logger.info({
        data: {
          status: 200,
          traceToken: req.traceToken,
          apiAction: "JWT_USER_VERFICATION",
          apiEndpoint: req.originalUrl,
          method: req.method,
          mess: "n/a",
        },
      });

      return done(null, user);
    } catch (error) {
      logger.error({
        data: {
          status: 500,
          traceToken: req.traceToken,
          apiAction: "JWT_USER_VERFICATION",
          apiEndpoint: req.originalUrl,
          method: req.method,
          mess: error.message,
        },
      });
      return done(error, false);
    }
  })
);

module.exports = passport;
