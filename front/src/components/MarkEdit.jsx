import { useState, useEffect } from "react";
import axios from "axios";

const MarksEdit = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/students")
      .then((res) => {
        setStudents(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load student data.");
        setLoading(false);
      });
  }, []);

  const handleMarksChange = (index, field, value) => {
    const updatedStudents = [...students];
    updatedStudents[index][field] = value !== "" ? parseInt(value, 10) : "";
    setStudents(updatedStudents);
  };

  const handleUpdate = () => {
    axios.post("http://localhost:5000/update-marks", { students })
      .then(() => {
        alert("Marks updated successfully!");
      })
      .catch(() => {
        alert("Failed to update marks.");
      });
  };

  if (loading) return <p className="text-center text-gray-500">Loading students...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Edit Student Marks</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 shadow-md">
          <thead>
            <tr className="bg-gray-200 text-gray-700 text-center">
              <th className="border border-gray-300 px-4 py-2">Student ID</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">IAT 1</th>
              <th className="border border-gray-300 px-4 py-2">IAT 2</th>
              <th className="border border-gray-300 px-4 py-2">IAT 3</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student.S_ID} className="text-center border-t border-gray-300">
                <td className="border border-gray-300 px-4 py-2">{student.S_ID}</td>
                <td className="border border-gray-300 px-4 py-2">{student.NAME}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="number"
                    value={student.IAT1 || ""}
                    onChange={(e) => handleMarksChange(index, "IAT1", e.target.value)}
                    className="w-16 border border-gray-400 p-1 text-center rounded"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="number"
                    value={student.IAT2 || ""}
                    onChange={(e) => handleMarksChange(index, "IAT2", e.target.value)}
                    className="w-16 border border-gray-400 p-1 text-center rounded"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="number"
                    value={student.IAT3 || ""}
                    onChange={(e) => handleMarksChange(index, "IAT3", e.target.value)}
                    className="w-16 border border-gray-400 p-1 text-center rounded"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={handleUpdate}
        className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        Update Marks
      </button>
    </div>
  );
};

export default MarksEdit;
