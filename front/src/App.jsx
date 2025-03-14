import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import LoginPage from "./components/LoginPage";
import TeacherDashboard from "./components/TeacherDashboard"; // Ensure correct import
import MarksTable from "./components/MarksTable";
import MarksEntry from "./components/MarksEntry";
import MarkEdit from "./components/MarkEdit";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/teacherdashboard" element={<TeacherDashboard />} />
        <Route path="/markstable" element={<MarksTable />} />
        <Route path="/marksentry" element={<MarksEntry />} />
        <Route path="/edit" element={<MarkEdit />} />
      </Routes>
    </Router>
  );
}

export default App;
