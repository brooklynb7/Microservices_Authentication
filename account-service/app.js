const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const passport = require("passport");
const GoogleAuth = require("passport-google-oauth");
const GoogleStrategy = GoogleAuth.OAuth2Strategy;
const se = require("../se.json");

const HttpsProxyAgent = require("https-proxy-agent");
const proxy = { host: "127.0.0.1", port: 6152 };
var agent = new HttpsProxyAgent(proxy);

const indexRouter = require("./routes/index");

const app = express();
// This is here for our client side to be able to talk to our server side. you may want to be less permissive in production and define specific domains.
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

const strategy = new GoogleStrategy(
  {
    clientID: se.web.client_id,
    clientSecret: se.web.client_secret,
    callbackURL: se.web.redirect_uris[0],
  },
  function (accessToken, refreshToken, profile, done) {
    console.log(accessToken);
    console.log(profile);
    // here you can create a user in the database if you want to
    return done(null, profile);
  }
);
strategy._oauth2.setAgent(agent);

passport.use(strategy);

module.exports = app;
