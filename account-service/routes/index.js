const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const se = require("../../se.json");

const TOKEN_SECRET = "SECRET";
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/error" }),
  function (req, res) {
    const token = jwt.sign(
      { id: req.user.id, name: req.user.name },
      se.token_secret,
      {
        expiresIn: 60 * 60,
      }
    );
    res.cookie("auth", token, { httpOnly: true });
    res.redirect("http://localhost:3000/");
  }
);

module.exports = router;
