const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { authenticate, authorize } = require("../middleware/auth");

router.use(authenticate);

router.get("/", authorize("admin"), async (req, res) => {
  const users = await User.find().select("-password").sort("-createdAt");
  res.json(users);
});

router.get("/:id", async (req, res) => {
  if (req.user.role !== "admin" && req.user._id.toString() !== req.params.id) {
    return res.status(403).json({ error: "Access denied" });
  }
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

router.patch("/:id", authorize("admin"), async (req, res) => {
  const { name, role, status, password } = req.body;
  const updates = {};
  if (name) updates.name = name;
  if (role) updates.role = role;
  if (status) updates.status = status;
  if (password) updates.password = await bcrypt.hash(password, 10);

  const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select("-password");
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ message: "User updated", user });
});

router.delete("/:id", authorize("admin"), async (req, res) => {
  if (req.user._id.toString() === req.params.id) {
    return res.status(400).json({ error: "Cannot delete yourself" });
  }
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ message: "User deleted" });
});

module.exports = router;