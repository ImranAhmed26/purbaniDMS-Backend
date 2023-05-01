import jwt from "jsonwebtoken";

import User from "../models/userSchema.js";
import { comparePassword, hashPassword } from "../utils/auth.js";

// Register User

const RegisterUser = async (req, res) => {
  try {
    // Destructure Req Body

    let { name, email, employeeId, password } = req.body;

    // Validation

    if (!name) return res.status(400).send("Name is required");
    if (!password || password.length < 6) {
      return res.status(400).send("Password is required and has to be min 6 characters long");
    }
    if (!email) return res.status(400).send("email is required");
    if (email) email = email.toLowerCase();
    let userEmailExist = await User.findOne({ email }).exec();
    if (userEmailExist) return res.status(401).send("Email is taken");

    if (!employeeId) return res.status(400).send("employeeId Number is required");
    let employeeIdNumberExist = await User.findOne({ employeeId }).exec();
    if (employeeIdNumberExist) return res.status(401).send("employeeId number is taken");

    // Hash Password
    const hashedPassword = await hashPassword(password);

    // Register
    const user = new User({
      name,
      email,
      employeeId,
      password: hashedPassword,
    });

    await user.save();
    res.status(200).send(user);
  } catch (error) {
    res.status(401).json(error);
    throw error;
  }
};

// Login

const LoginUser = async (req, res) => {
  try {
    let { employeeId, password } = req.body;
    if (employeeId) employeeId = employeeId.toLowerCase();
    const user = await User.findOne({ employeeId }).exec();
    if (!user) return res.status(404).send("User with employee Id not found");

    const matchPassword = comparePassword(password, user.password);
    if (!matchPassword) res.status(401).send("Password did not match");

    const accessToken = jwt.sign(
      { _id: user._id },
      process.env.JWT_ACCESS_TOKEN,
      {
        expiresIn: "7d",
      },
    );
    // Return user token to user excluding password and send headers
    user.password = undefined;

    res.json({ user, token: accessToken });
    console.log("Login successful");
  } catch (error) {
    console.log(error);
    return res.status(400).send("Error. Please Try Again");
  }
};

const LogoutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({ message: "Sign out success" });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export { RegisterUser, LoginUser, LogoutUser };
