const User = require("../model/User");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 10;

exports.createUser = async (req, res) => {
  const hashedPass = await bcrypt.hash(req.body.password, saltRounds);
  User.create({ email: req.body.email, password: hashedPass })
    .then((newUser) => {
      res.status(200).send(newUser);
    })
    .catch((err) => res.status(422).json({ err: err.message }));
};

exports.Login = (req, res) => {
  User.findOne({ email: req.body.email })
    .then(async (newUser) => {
      if (!newUser) {
        res.status(401).json({ err: "email doesn't exists." });
      }
      const matchedPass = await bcrypt.compare(
        req.body.password,
        newUser.password
      );
      if (!matchedPass) {
        res.status(401).json({ err: "password doesn't matched.." });
      }
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "2 days",
      });

      res.status(200).send({ auth: true, user: newUser, token: token });
    })
    .catch((err) => res.status(422).json({ err: err.message }));
};
