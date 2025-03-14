import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title } from "chart.js";

// Register chart components
ChartJS.register(BarElement, CategoryScale, LinearScale, Title);

const TeacherDashboard = () => {
  // Sample Data for Subjects
  const initialClasses = {
    ClassA: {
      Math: { pass: 15, fail: 5, notAttended: 3 },
      Science: { pass: 18, fail: 2, notAttended: 3 },
      English: { pass: 12, fail: 6, notAttended: 5 },
    },
    ClassB: {
      Math: { pass: 20, fail: 7, notAttended: 2 },
      Science: { pass: 14, fail: 8, notAttended: 4 },
      English: { pass: 17, fail: 5, notAttended: 4 },
    },
    ClassC: {
      Math: { pass: 22, fail: 3, notAttended: 4 },
      Science: { pass: 19, fail: 6, notAttended: 2 },
      English: { pass: 14, fail: 7, notAttended: 6 },
    },
  };

  const [selectedClass, setSelectedClass] = useState("ClassA");

  // Get Subjects for the selected class
  const subjects = Object.keys(initialClasses[selectedClass]);

  // Chart Data Preparation
  const chartData = {
    labels: subjects,
    datasets: [
      {
        label: "Pass",
        data: subjects.map((subject) => initialClasses[selectedClass][subject].pass),
        backgroundColor: "green",
      },
      {
        label: "Fail",
        data: subjects.map((subject) => initialClasses[selectedClass][subject].fail),
        backgroundColor: "red",
      },
      {
        label: "Not Attended",
        data: subjects.map((subject) => initialClasses[selectedClass][subject].notAttended),
        backgroundColor: "gray",
      },
    ],
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>

      {/* Class Selection */}
      <label className="block font-semibold mb-2">Select Class:</label>
      <select
        value={selectedClass}
        onChange={(e) => setSelectedClass(e.target.value)}
        className="border p-2 mb-4"
      >
        {Object.keys(initialClasses).map((className) => (
          <option key={className} value={className}>
            {className}
          </option>
        ))}
      </select>

      {/* Subject Performance Table */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Pass/Fail/Not Attended Count</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Subject</th>
                <th className="border p-2">Pass</th>
                <th className="border p-2">Fail</th>
                <th className="border p-2">Not Attended</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject}>
                  <td className="border p-2">{subject}</td>
                  <td className="border p-2">{initialClasses[selectedClass][subject].pass}</td>
                  <td className="border p-2">{initialClasses[selectedClass][subject].fail}</td>
                  <td className="border p-2">{initialClasses[selectedClass][subject].notAttended}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chart in a Card View */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Performance Overview</h2>
        <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-md mx-auto">
          <div className="w-full h-64">
            <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
