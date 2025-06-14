const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const isValidIITIMail = (email) => /^[a-zA-Z0-9._%+-]+@uel\.ac\.uk$/.test(email.toLowerCase());

// Register
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!isValidIITIMail(email)) {
      return res.status(400).json({ message: "Only @uel.ac.uk email addresses are allowed" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const user = new User({ email, password });
    await user.save();

    res.status(201).json({ message: "User registered successfully", user: { id: user._id, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!isValidIITIMail(email)) {
      return res.status(400).json({ message: "Only @uel.ac.uk email addresses are allowed" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "2h" });

    res.status(200).json({
      user: { _id: user._id, email: user.email },
      token,
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

// Get own profile
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Update profile
exports.updateMyProfile = async (req, res) => {
  const { name, rollNo, degree, bio, major, avatar } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.name = name ?? user.name;
    user.rollNo = rollNo ?? user.rollNo;
    user.degree = degree ?? user.degree;
    user.bio = bio ?? user.bio;
    user.major = major ?? user.major;
    user.avatar = avatar ?? user.avatar;

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
