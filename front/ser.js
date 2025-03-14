import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/admindb")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Schema Definition
const studentSchema = new mongoose.Schema({
  S_ID: String,
  NAME: String,
  DS: { type: String, default: null },
  CD: { type: String, default: null },
  ED: { type: String, default: null },
  IIOT: { type: String, default: null },
  SDN: { type: String, default: null },
  EBA: { type: String, default: null },
  PC: { type: String, default: null },
  CGPA: { type: String, default: null },
});

const Student = mongoose.model("Student", studentSchema);

// Fetch all students
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find({});
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

// Insert new student marks
app.post("/add-marks", async (req, res) => {
  try {
    const { S_ID, NAME, DS, CD, ED, IIOT, SDN, EBA,PC } = req.body;
    const newStudent = new Student({ S_ID, NAME, DS, CD, ED, IIOT, SDN, EBA,PC });
    await newStudent.save();
    res.json({ message: "Marks added successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add marks" });
  }
});

// Update student marks
app.post("/update-marks", async (req, res) => {
  try {
    const { students } = req.body;
    if (!Array.isArray(students)) {
      return res.status(400).json({ error: "Invalid data format. Expected an array of students." });
    }
    
    for (const student of students) {
      const updateFields = { CGPA: student.CGPA};
      if (student.DS !== undefined) updateFields.DS = student.DS;
      if (student.CD !== undefined) updateFields.CD = student.CD;
      if (student.ED !== undefined) updateFields.ED = student.ED;
      if (student.IIOT !== undefined) updateFields.IIOT = student.IIOT;
      if (student.SDN !== undefined) updateFields.SDN = student.SDN;
      if (student.EBA !== undefined) updateFields.EBA = student.EBA;
      if (student.PC !== undefined) updateFields.PC = student.PC;
      if (student.CGPA !== undefined) updateFields.CGPA = student.CGPA;

      await Student.updateOne({ S_ID: student.S_ID }, { $set: updateFields });
    }
    
    res.json({ message: "Marks updated successfully!" });
  } catch (error) {
    console.error("Error updating marks:", error);
    res.status(500).json({ error: "Failed to update marks" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
