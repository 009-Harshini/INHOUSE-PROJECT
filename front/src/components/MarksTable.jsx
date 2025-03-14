import React, { useState, useEffect } from "react";

const MarksTable = () => {
    const [marks, setMarks] = useState([]);
    const [studentName, setStudentName] = useState("");
    const [subject, setSubject] = useState("");
    const [marksValue, setMarksValue] = useState("");
    const [teacherName, setTeacherName] = useState("");

    // Fetch marks from the backend
    useEffect(() => {
        fetchMarks();
    }, []);

    const fetchMarks = async () => {
        try {
            const response = await fetch("http://localhost:5000/marks");
            const data = await response.json();
            setMarks(data);
        } catch (error) {
            console.error("Error fetching marks:", error);
        }
    };

    // Function to add marks
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!studentName || !subject || !marksValue || !teacherName) {
            alert("All fields are required!");
            return;
        }

        const newMark = { studentName, subject, marks: marksValue, teacherName };

        try {
            const response = await fetch("http://localhost:5000/add-marks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newMark),
            });

            if (response.ok) {
                fetchMarks(); // Refresh marks table
                setStudentName("");
                setSubject("");
                setMarksValue("");
                setTeacherName("");
            } else {
                console.error("Failed to add marks");
            }
        } catch (error) {
            console.error("Error adding marks:", error);
        }
    };

    return (
        <div>
            <h2>Enter Marks</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Student Name"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Marks"
                    value={marksValue}
                    onChange={(e) => setMarksValue(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Teacher Name"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    required
                />
                <button type="submit">Add Marks</button>
            </form>

            <h2>Marks Table</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Subject</th>
                        <th>Marks</th>
                        <th>Teacher Name</th>
                    </tr>
                </thead>
                <tbody>
                    {marks.map((mark) => (
                        <tr key={mark._id}>
                            <td>{mark.studentName}</td>
                            <td>{mark.subject}</td>
                            <td>{mark.marks}</td>
                            <td>{mark.teacherName}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MarksTable;
