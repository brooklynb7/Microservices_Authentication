const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const se = require("../se.json");

const indexRouter = require("./routes/index");

const app = express();
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;

app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);

const cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["auth"];
  }
  return token;
};

const opts = {
  jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
  secretOrKey: se.token_secret,
};

passport.use(
  "jwt",
  new JwtStrategy(opts, (jwt_payload, done) => {
    try {
      console.log("jwt_payload", jwt_payload);
      done(null, jwt_payload);
    } catch (err) {
      done(err);
    }
  })
);

module.exports = app;
