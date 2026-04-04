require("dotenv").config();
const express = require("express");
const { connectDb } = require("./models/db");

const app = express();
app.use(express.json());

app.use((req, _res, next) => { console.log(`${req.method} ${req.path}`); next(); });

app.use("/auth",      require("./routes/auth"));
app.use("/users",     require("./routes/users"));
app.use("/records",   require("./routes/records"));
app.use("/dashboard", require("./routes/dashboard"));

app.get("/", (_req, res) => res.json({ status: "ok" }));
app.use((_req, res) => res.status(404).json({ error: "Route not found" }));
app.use((err, _req, res, _next) => { console.error(err); res.status(500).json({ error: "Server error" }); });

const PORT = process.env.PORT || 3000;
connectDb().then(() => app.listen(PORT, () => console.log(`🚀 Running at http://localhost:${PORT}`)));