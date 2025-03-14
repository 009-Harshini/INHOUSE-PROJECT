import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend
} from "recharts";

// API URL (Replace with your actual API endpoint)
const API_URL = "http://localhost:5000/api/student";

const StudentDashboard = ({ sid }) => {
  const [studentData, setStudentData] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(1); // Default to Semester 1
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!sid) return;
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/${sid}`);
        if (!response.ok) throw new Error("Student not found");

        const data = await response.json();

        // Transform data into an array format for easy mapping
        const semesters = Array.from({ length: 8 }, (_, i) => ({
          semester: i + 1,
          GPA: data[`Semester${i + 1}`] || 0,
          Attendance: data[`Attendance${i + 1}`] || 0,
          internals: {
            "IA 1": data[`IA${i + 1}_1`] || 0,
            "IA 2": data[`IA${i + 1}_2`] || 0,
            "IA 3": data[`IA${i + 1}_3`] || 0,
          },
          assignments: {
            "A 1": data[`A${i + 1}_1`] || 0,
            "A 2": data[`A${i + 1}_2`] || 0,
            "A 3": data[`A${i + 1}_3`] || 0,
          },
        }));

        setStudentData({ ...data, semesters });
      } catch (error) {
        console.error("Error fetching student data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sid]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-2xl">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;

  const currentSemesterData = studentData.semesters.find((s) => s.semester === selectedSemester) || {};

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex">
      {/* Sidebar for Semester Selection */}
      <div className="w-1/5 bg-gray-800 text-white p-4 rounded-lg">
        <h2 className="text-lg font-bold mb-4 text-center">Select Semester</h2>
        <select
          className="p-2 border rounded-lg bg-white text-gray-800 w-full"
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(Number(e.target.value))}
        >
          {studentData.semesters.map((sem) => (
            <option key={sem.semester} value={sem.semester}>
              Semester {sem.semester}
            </option>
          ))}
        </select>
      </div>

      {/* Main Dashboard */}
      <div className="flex-1 p-6">
        <div className="bg-white shadow-lg rounded-xl p-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Student Dashboard</h1>
          <p className="text-gray-600 mt-2">Performance Overview</p>
          <div className="mt-4 text-left space-y-2">
            <p><strong>Name:</strong> {studentData.name}</p>
            <p><strong>Student ID:</strong> {studentData.SID}</p>
            <p><strong>Department:</strong> {studentData.dept}</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-8">
  {/* Internal Assessment Marks */}
  <div className="bg-white shadow-lg rounded-xl p-6">
    <h2 className="text-xl font-semibold text-gray-800 text-center">
      Internal Assessment Marks - Semester {selectedSemester}
    </h2>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={Object.entries(currentSemesterData.internals || {}).map(([assessment, marks]) => ({ assessment, marks }))}>
        <defs>
          <linearGradient id="internalGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#FF5733" stopOpacity={1} />
            <stop offset="100%" stopColor="#C70039" stopOpacity={1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="assessment" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="marks" fill="url(#internalGradient)" />
      </BarChart>
    </ResponsiveContainer>
  </div>

  {/* Assignment Marks */}
  <div className="bg-white shadow-lg rounded-xl p-6">
    <h2 className="text-xl font-semibold text-gray-800 text-center">
      Assignment Marks - Semester {selectedSemester}
    </h2>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={Object.entries(currentSemesterData.assignments || {}).map(([assignment, marks]) => ({ assignment, marks }))}>
        <defs>
          <linearGradient id="assignmentGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#2196F3" stopOpacity={1} />
            <stop offset="100%" stopColor="#00BCD4" stopOpacity={1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="assignment" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="marks" fill="url(#assignmentGradient)" />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>

{/* GPA Chart */}
<div className="bg-white shadow-lg rounded-xl p-6 mt-8">
  <h2 className="text-xl font-semibold text-gray-800 text-center">GPA Trend</h2>
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={studentData.semesters}>
      <defs>
        <linearGradient id="gpaGradient" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#FF69B4" stopOpacity={1} />
          <stop offset="100%" stopColor="#C71585" stopOpacity={1} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="semester" />
      <YAxis domain={[0, 10]} />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="GPA" stroke="url(#gpaGradient)" strokeWidth={3} />
    </LineChart>
  </ResponsiveContainer>
</div>


        {/* Attendance Chart (Updated) */}
        <div className="bg-white shadow-lg rounded-xl p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-800 text-center">Attendance Rate</h2>
          <ResponsiveContainer width="100%" height={300}>
  <BarChart data={studentData.semesters}>
    <defs>
      <linearGradient id="attendanceGradient" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
        <stop offset="100%" stopColor="#064e3b" stopOpacity={1} />
      </linearGradient>
    </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="semester" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Attendance" fill="url(#attendanceGradient)" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
