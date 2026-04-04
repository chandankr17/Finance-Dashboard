const router = require("express").Router();
const Record = require("../models/Record");
const { authenticate, authorize } = require("../middleware/auth");

router.use(authenticate);

router.get("/", async (req, res) => {
  const { type, category, from, to, page = 1, limit = 20 } = req.query;
  const filter = { deletedAt: null };
  if (type) filter.type = type;
  if (category) filter.category = new RegExp(category, "i");
  if (from || to) filter.date = {};
  if (from) filter.date.$gte = from;
  if (to) filter.date.$lte = to;

  const records = await Record.find(filter)
    .populate("createdBy", "name")
    .sort("-date")
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ page: Number(page), limit: Number(limit), data: records });
});

router.get("/:id", async (req, res) => {
  const record = await Record.findOne({ _id: req.params.id, deletedAt: null });
  if (!record) return res.status(404).json({ error: "Record not found" });
  res.json(record);
});

router.post("/", authorize("admin"), async (req, res) => {
  const { amount, type, category, date, notes } = req.body;
  if (!amount || !type || !category || !date) {
    return res.status(400).json({ error: "amount, type, category, date are required" });
  }
  const record = await Record.create({ amount, type, category, date, notes, createdBy: req.user._id });
  res.status(201).json({ message: "Record created", id: record._id });
});

router.patch("/:id", authorize("admin"), async (req, res) => {
  const record = await Record.findOneAndUpdate(
    { _id: req.params.id, deletedAt: null },
    req.body,
    { new: true }
  );
  if (!record) return res.status(404).json({ error: "Record not found" });
  res.json({ message: "Record updated", record });
});

router.delete("/:id", authorize("admin"), async (req, res) => {
  const record = await Record.findOneAndUpdate(
    { _id: req.params.id, deletedAt: null },
    { deletedAt: new Date() }
  );
  if (!record) return res.status(404).json({ error: "Record not found" });
  res.json({ message: "Record deleted" });
});

module.exports = router;