import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import StudentDashboard from "./StudentDashboard";
import TeacherDashboard from "./TeacherDashboard";

const LoginPage = () => {
  const [isAdmin, setIsAdmin] = useState(true);
  const [username, setUsername] = useState("");
  const [confirmUsername, setConfirmUsername] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sid, setSid] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isAdmin 
        ? "http://localhost:5000/api/faculty-login"
        : "http://localhost:5000/api/login";
  
      const payload = isAdmin 
        ? { fid: username, confirmFid: confirmUsername }
        : { sid: username, confirmSid: confirmUsername };
  
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
      console.log("Response Data:", data); // Debugging
  
      if (data.valid) {
        setIsLoggedIn(true);
        setError("");
  
        if (isAdmin) {
          console.log("Navigating with facultyId:", data.facultyId); // Debugging
          navigate("/teacherdashboard", { state: { facultyId: data.facultyId } });
        } else {
          setSid(username);
        }
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Server Error! Please try again.");
    }
  };
  
  if (isLoggedIn && !isAdmin) {
    return <StudentDashboard sid={sid} />;
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-200">
      <motion.div
        className="bg-white shadow-lg rounded-2xl p-8 flex w-full max-w-4xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-1/2 p-6 flex flex-col items-center">
          <div className="flex w-full mb-6">
            <button
              className={`w-1/2 py-2 rounded-l-lg ${isAdmin ? "bg-gray-900 text-white" : "bg-gray-300 text-gray-700"}`}
              onClick={() => setIsAdmin(true)}
            >
              Faculty
            </button>
            <button
              className={`w-1/2 py-2 rounded-r-lg ${!isAdmin ? "bg-gray-900 text-white" : "bg-gray-300 text-gray-700"}`}
              onClick={() => setIsAdmin(false)}
            >
              Student
            </button>
          </div>

          <motion.div
            key={isAdmin ? "admin" : "student"}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <h2 className="text-2xl font-bold text-center mb-4">
              {isAdmin ? "Faculty Login" : "Student Login"}
            </h2>

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-gray-700">
                  {isAdmin ? "Faculty ID" : "Student ID"}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder={isAdmin ? "Enter Faculty ID" : "Enter Student ID"}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">
                  {isAdmin ? "Confirm Faculty ID" : "Confirm Student ID"}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder={isAdmin ? "Re-enter Faculty ID" : "Re-enter Student ID"}
                  value={confirmUsername}
                  onChange={(e) => setConfirmUsername(e.target.value)}
                />
              </div>

              {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

              <button
                type="submit"
                className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-900 transition"
              >
                {isAdmin ? "Login as Faculty" : "Login as Student"}
              </button>
            </form>
          </motion.div>
        </div>

        <div className="w-1/2 bg-gray-200 flex rounded-2xl justify-center items-center">
          <motion.img
            src="performlogin.png"
            alt="Login Illustration"
            className="w-3/4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;