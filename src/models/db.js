const mongoose = require("mongoose");

async function connectDb() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB connected");
}

module.exports = { connectDb };