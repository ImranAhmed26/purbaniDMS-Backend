import User from "../models/userSchema.js";

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.password = undefined;
    // console.log(user);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(401).send("Error. Please try again");
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select(["-password"]);
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(400).send("Error. Please try again");
  }
};

const updateUser = async (req, res) => {
  let { name, email } = req.body;
  try {
    let user = await User.findByIdAndUpdate(req.params.id);
    if (!user) return res.status(400).send("Error. Please try again");

    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();

    const updatedUser = await user.save();
    user.password = undefined;
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(400).send("Error, Please try again");
  }
};

const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedUser);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

export { getUsers, getUser, updateUser, deleteUser };
