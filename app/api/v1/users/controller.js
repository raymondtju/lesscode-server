const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

const User = require("./model");
const { BadRequest } = require("../../../errors");
const { createToken } = require("../../../utils/jwt");
const { sendMail } = require("../../../services/mail");

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
  let random = Math.floor(100000 + Math.random() * 900000);
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
      status: "inactive",
      verificationCode: random,
    });
    await sendMail(user.email, user.verificationCode);
    delete user._doc.password;
    delete user._doc.__v;
    delete user._doc.createdAt;
    delete user._doc.updatedAt;
    delete user._doc.role;
    delete user._doc.verificationCode;

    res.status(201).json({
      message: "User created successfully.",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

const verifyUser = async (req, res, next) => {
  try {
    const { verificationCode } = req.body;
    const { id } = req.query;

    const check = await User.findOne({ _id: id, verificationCode });
    if (!check) {
      throw new BadRequest("Invalid verification code.");
    }
    if (check.status === "active") {
      throw new BadRequest("User already verified.");
    }

    const user = await User.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        status: "active",
      }
    );

    res.status(200).json({
      message: "User verified !",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  validateUser,
  verifyUser,
};
