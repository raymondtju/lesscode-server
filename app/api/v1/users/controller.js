const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

const User = require("./model");
const { BadRequest } = require("../../../errors");
const { createToken } = require("../../../utils/jwt");

const validateUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await User.findOne({ email });
    if (!result) {
      throw new BadRequest("User not found.");
    }

    const checkPassword = bcrypt.compareSync(password, result.password);
    if (!checkPassword) {
      throw new BadRequest("Password is incorrect.");
    }

    const token = createToken({ email: result.email, id: result._id });

    res.status(200).json({
      token: token,
    });
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    let { username, firstName, lastName, email, password, confPassword, age } =
      req.body;
    if (password !== confPassword) {
      throw new BadRequest("Password and confirm password do not match.");
    }

    password = bcrypt.hashSync(password, salt);
    const user = await User.create({
      username,
      firstName,
      lastName,
      email,
      password,
      age,
    });
    delete user._doc.password;
    delete user._doc.__v;
    delete user._doc.createdAt;
    delete user._doc.updatedAt;
    delete user._doc.role;

    res.status(201).json({
      message: "User created successfully.",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createUser,
  validateUser,
};
