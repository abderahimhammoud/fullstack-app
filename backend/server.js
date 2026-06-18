require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "API is running",
  });
});

app.use("/api/auth", authRoutes);

mongoose.set('strictQuery', false);

const startServer = () => {
  app.use(express.static(path.join(__dirname, "..", "frontend", "build")));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "frontend", "build", "index.html"));
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

if (MONGO_URI) {
  mongoose
    .connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    })
    .then(() => {
      console.log("MongoDB connected");
      startServer();
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err.message);
      process.exit(1);
    });
} else {
  console.warn("MONGO_URI is not defined");
  startServer();
}
module.exports = app;
