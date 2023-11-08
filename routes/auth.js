const express = require("express");
const { body } = require("express-validator");
const User = require("../models/user");

const authController = require("../controllers/auth");

const router = express.Router();

router.post(
  "/signup",
  [
    body("email").notEmpty().withMessage("Please fill in your email"),
    body("password").notEmpty().withMessage("Please fill in your password"),
    body("confirmPassword")
      .notEmpty()
      .withMessage("Please fill in your Confirm Password"),
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "E-Mail exists already, please pick a different one."
            );
          }
        });
      }),
    body(
      "password",
      "Please enter a password with only numbers and text and at least 8 characters."
    )
      .isLength({ min: 8 })
      .isAlphanumeric(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords have to match!");
      }
      return true;
    }),
  ],
  authController.postSignup
);

router.post(
  "/login",
  [
    body("email").notEmpty().withMessage("Please fill in your email"),
    body("password").notEmpty().withMessage("Please fill in your password"),
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom(async (value) => {
        const existingUser = await User.findOne({ email: value });
        if (!existingUser) {
          throw new Error("Invalid email or password.");
        }
      }),
  ],
  authController.postLogin
);

module.exports = router;
