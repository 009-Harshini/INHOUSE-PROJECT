import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/studentDB");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

connectDB();

// Student Schema
const StudentSchema = new mongoose.Schema({
  SID: { type: String, required: true, unique: true },
  name: { type: String },
  dept: { type: String },
  semesters: [
    {
      semester: Number,
      GPA: Number,
      Attendance: Number,
      internals: {
        IA1: Number,
        IA2: Number,
        IA3: Number
      },
      assignments: {
        A1: Number,
        A2: Number,
        A3: Number
      }
    }
  ]
});

const Student = mongoose.model("Student", StudentSchema, "studentdata");

// Student Login Route
app.post("/api/login", async (req, res) => {
  const { sid, confirmSid } = req.body;
  if (!sid || !confirmSid) {
    return res.status(400).json({ valid: false, message: "Both Student ID fields are required!" });
  }

  const student = await Student.findOne({ SID: sid.trim() });
  if (!student) {
    return res.status(404).json({ valid: false, message: "Invalid Student ID!" });
  }

  return res.json({ valid: sid.trim() === confirmSid.trim(), message: "Login successful!" });
});

// Fetch student by ID
app.get("/api/student/:sid", async (req, res) => {
  try {
    const student = await Student.findOne({ SID: req.params.sid });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Fetch all students
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Error fetching students" });
  }
});

// Update Student Data
app.put("/api/student/:sid", async (req, res) => {
  try {
    const updatedStudent = await Student.findOneAndUpdate(
      { SID: req.params.sid },
      { $set: req.body },
      { new: true }
    );
    if (!updatedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ error: "Error updating student" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
