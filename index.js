// index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5500;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB connection
mongoose.connect("mongodb:http://127.0.0.1:5500/public/register1.html")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Student Schema & Model
const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  batch: String,
  profession: String,
  password: String
});

const Student = mongoose.model("Student", studentSchema);

// ✅ Root route (to check server is alive)
app.get("/", (req, res) => {
  res.send("🚀 API is running on port 4000");
});

// ✅ Register new student
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, batch, profession, password } = req.body;

    // check if already exists
    const existing = await Student.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Student already registered with this email" });
    }

    const newStudent = new Student({ name, email, batch, profession, password });
    await newStudent.save();

    res.status(201).json({ message: "Student registered successfully" });
  } catch (err) {
    console.error("Error registering student:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get all students
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find({}, "-password"); // exclude password field
    res.json(students);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
