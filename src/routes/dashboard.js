const router = require("express").Router();
const Record = require("../models/Record");
const { authenticate, authorize } = require("../middleware/auth");

router.use(authenticate);

router.get("/summary", async (req, res) => {
  const result = await Record.aggregate([
    { $match: { deletedAt: null } },
    { $group: {
      _id: null,
      total_income:   { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
      total_expenses: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } },
      total_records:  { $sum: 1 }
    }}
  ]);
  const data = result[0] || { total_income: 0, total_expenses: 0, total_records: 0 };
  data.net_balance = data.total_income - data.total_expenses;
  res.json(data);
});

router.get("/by-category", authorize("analyst", "admin"), async (req, res) => {
  const data = await Record.aggregate([
    { $match: { deletedAt: null } },
    { $group: { _id: { category: "$category", type: "$type" }, total: { $sum: "$amount" }, count: { $sum: 1 } } },
    { $sort: { total: -1 } }
  ]);
  res.json(data);
});

router.get("/monthly", authorize("analyst", "admin"), async (req, res) => {
  const data = await Record.aggregate([
    { $match: { deletedAt: null } },
    { $group: {
      _id: { $substr: ["$date", 0, 7] },
      income:   { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
      expenses: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } },
    }},
    { $sort: { _id: -1 } },
    { $limit: 12 }
  ]);
  res.json(data);
});

router.get("/recent", async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 5, 20);
  const data = await Record.find({ deletedAt: null })
    .populate("createdBy", "name")
    .sort("-createdAt")
    .limit(limit);
  res.json(data);
});

module.exports = router;