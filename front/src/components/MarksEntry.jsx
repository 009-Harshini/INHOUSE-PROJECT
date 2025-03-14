import { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const gradeMapping = {
  O: 10,
  "A+": 9,
  A: 8,
  "B+": 7,
  B: 6,
  C: 5,
  U: 0,
  AB: 0, // Absent
};

const subjectCredits = {
  DS: 3,
  CD: 3,
  ED: 3,
  IIOT: 3,
  SDN: 3,
  EBA: 3,
  PC: 1,
};

const calculateCGPA = (student) => {
  let totalCredits = 0;
  let totalGradePoints = 0;
  Object.keys(subjectCredits).forEach((subject) => {
    const grade = student[subject];
    if (grade in gradeMapping) {
      totalGradePoints += gradeMapping[grade] * subjectCredits[subject];
      totalCredits += subjectCredits[subject];
    }
  });
  return totalCredits ? (totalGradePoints / totalCredits).toFixed(2) : "N/A";
};

const MarksEntry = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/students")
      .then((res) => {
        const updatedStudents = res.data.map((student) => ({
          ...student,
          CGPA: calculateCGPA(student),
        }));
        setStudents(updatedStudents);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching students:", err);
        setError("Failed to load student data.");
        setLoading(false);
      });
  }, []);


  
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth(); // Get page width
    const text = "VELAMMAL COLLEGE OF ENGINEERING AND TECHNOLOGY - MADURAI";
    const textWidth = doc.getTextWidth(text); // Get text width
    doc.text(text, (pageWidth - textWidth) / 2, 10);
    
   

    const tableColumn = ["Student ID", "Name", ...Object.keys(subjectCredits), "CGPA"];
    const tableRows = students.map((student) => [
      student.S_ID,
      student.NAME,
      ...Object.keys(subjectCredits).map((field) => student[field] || ""),
      student.CGPA,
    ]);

    autoTable(doc, { startY: 20, head: [tableColumn], body: tableRows });
    doc.save("Student_CGPA_Marks_Report.pdf");
  };

  const handleMarksChange = (studentId, field, value) => {
    const validGrades = Object.keys(gradeMapping);
    const formattedValue = value.toUpperCase();

    if (validGrades.includes(formattedValue) || value === "") {
      setStudents((prevStudents) =>
        prevStudents.map((student) => {
          if (student.S_ID === studentId) {
            const updatedStudent = { ...student, [field]: formattedValue };
            return { ...updatedStudent, CGPA: calculateCGPA(updatedStudent) };
          }
          return student;
        })
      );
    }
  };

  const handleSubmit = () => {
    const marksData = students.map((student) => ({
      S_ID: student.S_ID,
      NAME: student.NAME,
      CGPA: student.CGPA,
      ...Object.keys(subjectCredits).reduce(
        (acc, field) => ({ ...acc, [field]: student[field] || "" }),
        {}
      ),
    }));

   

    axios
      .post("http://localhost:5000/update-marks", { students: marksData })
      .then(() => {
        alert("Marks and CGPA updated successfully!");
        setIsEditing(false);
      })
      .catch((err) => {
        console.error("Error updating marks:", err.response?.data || err.message);
        alert("Failed to update marks.");
      });
  };

  if (loading) return <p className="text-center text-gray-500">Loading students...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between mb-4">
        <button
          onClick={generatePDF}
          className="w-40 py-2 rounded text-white bg-red-600 hover:bg-red-500"
        >
          Generate PDF
        </button>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="w-40 py-2 rounded text-white bg-blue-600 hover:bg-blue-500"
        >
          {isEditing ? "Disable Edit" : "Edit Marks"}
        </button>
      </div>
      <h2 className="text-xl font-bold mb-4 text-center">Enter Student Marks</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Student ID</th>
              <th className="border p-2">Name</th>
              {Object.keys(subjectCredits).map((subject) => (
                <th key={subject} className="border p-2">{subject}</th>
              ))}
              <th className="border p-2">CGPA</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.S_ID} className="text-center">
                <td className="border p-2">{student.S_ID}</td>
                <td className="border p-2">{student.NAME}</td>
                {Object.keys(subjectCredits).map((field) => (
                  <td key={field} className="border p-2">
                    <input
                      type="text"
                      value={student[field] || ""}
                      onChange={(e) => handleMarksChange(student.S_ID, field, e.target.value)}
                      className="w-full p-2 border rounded text-center"
                      placeholder={field}
                      disabled={!isEditing}
                    />
                  </td>
                ))}
                <td className="border p-2">{student.CGPA}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center mt-4">
        <button
          onClick={handleSubmit}
          className="w-40 py-2 rounded text-white bg-green-600 hover:bg-green-500"
        >
          Submit Marks
        </button>
      </div>
    </div>
  );
};

export default MarksEntry;
