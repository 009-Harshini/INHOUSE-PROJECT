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

// Student Schema (Unchanged)
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

// Faculty Schema
const FacultySchema = new mongoose.Schema({
  FID: { type: String, required: true, unique: true },
  Name: { type: String }
});

const Faculty = mongoose.model("Faculty", FacultySchema, "facultydata");

// Student Login Route (Unchanged)
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

// Faculty Login Route
app.post("/api/faculty-login", async (req, res) => {
  const { fid, confirmFid } = req.body;

  if (!fid || !confirmFid || fid !== confirmFid) {
    return res.json({ valid: false, message: "Invalid Faculty ID!" });
  }

  const faculty = await Faculty.findOne({ FID: fid.trim() });
  if (!faculty) {
    return res.status(404).json({ valid: false, message: "Invalid Faculty ID!" });
  }

  res.json({ valid: true, facultyId: faculty.FID, name: faculty.name });
});

// Fetch student by ID (Unchanged)
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

// Fetch faculty by ID
app.get("/api/faculty/:fid", async (req, res) => {
  try {
    const facultyId = req.params.fid.trim();
    console.log("Received Faculty ID:", facultyId);

    const faculty = await Faculty.findOne({ FID: facultyId });
    console.log("Faculty Found:", faculty); // Log the full document

    if (!faculty) {
      console.log("Faculty not found for ID:", facultyId);
      return res.status(404).json({ error: "Faculty not found" });
    }

    res.json({
      facultyId: faculty.FID,
      name: faculty.Name || "No Name Available", // Handle missing name
    });
  } catch (error) {
    console.error("Error fetching faculty:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// Fetch all students (Unchanged)
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Error fetching students" });
  }
});

// Fetch all faculty
app.get("/api/faculties", async (req, res) => {
  try {
    const faculties = await Faculty.find();
    res.json(faculties);
  } catch (error) {
    res.status(500).json({ error: "Error fetching faculty" });
  }
});

// Update Student Data (Unchanged)
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

// Update Faculty Data
app.put("/api/faculty/:fid", async (req, res) => {
  try {
    const updatedFaculty = await Faculty.findOneAndUpdate(
      { FID: req.params.fid },
      { $set: req.body },
      { new: true }
    );
    if (!updatedFaculty) {
      return res.status(404).json({ error: "Faculty not found" });
    }
    res.json(updatedFaculty);
  } catch (error) {
    res.status(500).json({ error: "Error updating faculty" });
  }
});

// Fetch teacher by ID
app.get("/api/teacher/:tid", async (req, res) => {
  try {
    const teacher = await Faculty.findOne({ FID: req.params.tid });
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
