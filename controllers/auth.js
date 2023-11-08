const bcrypt = require("bcryptjs");
const User = require("../models/user");

const { validationResult } = require("express-validator");

exports.postSignup = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(402).json({ errors: errors.array() });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      password: hashedPassword,
      cart: { items: [] },
    });
    await user.save();
    res.status(200).json("Signup Success");
  } catch (error) {
    console.log(error);
  }
};

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(402).json({ errors: errors.array() });
  }
  try {
    const user = await User.findOne({ email });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(402)
        .json({ errors: [{ msg: "Invalid email or password." }] });
    }
    return res.status(200).json("Login Success");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};
