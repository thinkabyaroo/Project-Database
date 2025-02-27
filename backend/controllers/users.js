const User = require("../models/user");
const Rental = require("../models/rental");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-__v");
    res.json(users).status(200);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.getUserDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "Not Found" });
    res.send(user).status(200);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.createUser = async (req, res) => {
  const userSchema = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    isAdmin: req.body.isAdmin,
  });
  try {
    const oldUser = await User.findOne({ email: req.body.email });
    if (oldUser)
      return res
        .status(409)
        .json({ message: "User with same idenity exists!" });
    const user = await userSchema.save();
    const token = user.generateAuthToken();
    res.status(201).json({ user, token });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const filter = { _id: id };
  const update = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  try {
    const updateduser = await User.findOneAndUpdate(filter, update, {
      new: true,
    });
    await Rental.updateMany(
      { "customer._id": id },
      { "customer.name": update.name },
      { new: true }
    );

    res.status(200).json(updateduser);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User Not Found!" });
    await User.deleteOne(user);
    await Rental.deleteMany({ "customer._id": id });
    res.status(204).json({ message: "Successfully Deleted" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
