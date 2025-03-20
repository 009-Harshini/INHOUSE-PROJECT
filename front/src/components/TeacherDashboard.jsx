import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, Typography, Avatar, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";

const TeacherDashboard = () => {
  const location = useLocation();
  const facultyId = location.state?.facultyId || "Unknown Faculty";
  const [facultyDetails, setFacultyDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Faculty ID from location state:", facultyId); // Log facultyId

    const fetchFacultyDetails = async () => {
      if (!facultyId) return;
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/faculty/${facultyId}`);
        if (!response.ok) throw new Error("Faculty not found");

        const data = await response.json();
        console.log("Faculty details fetched:", data); // Log fetched data
        setFacultyDetails(data);
      } catch (error) {
        console.error("Error fetching faculty details:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFacultyDetails();
  }, [facultyId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-2xl">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg rounded-xl">
          <CardContent className="p-6 text-center">
            <Typography variant="h4" className="font-bold text-gray-800 mb-4">
              Faculty Dashboard
            </Typography>

            {facultyDetails ? (
              <>
                {/* Faculty Avatar */}
                <Avatar sx={{ width: 80, height: 80 }} className="mx-auto bg-blue-500">
                  {facultyDetails.name?.charAt(0)}
                </Avatar>

                {/* Faculty Info */}
                <Typography variant="h5" className="font-semibold text-gray-900 mt-3">
                  {facultyDetails.name}
                </Typography>
                <Typography variant="subtitle1" className="text-gray-600">
                  Faculty ID: {facultyDetails.facultyId}
                </Typography>
              </>
            ) : (
              <Typography variant="h6" className="text-center text-red-500">
                Faculty details not found.
              </Typography>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default TeacherDashboard;