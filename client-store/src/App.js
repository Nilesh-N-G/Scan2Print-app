import "./App.css";
import React, { useState, useEffect } from "react";
import { Container } from "@mui/material";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebaseConfig";
import axios from "axios";
import SignIn from "./components/Homepage";
import DashboardMain from "./components/DashboardMain";
import ManageQRCode from "./components/ManageQRCode"; 
import Layout from "./components/Layout"; 
function App() {
  const [user, setUser] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [userInfo, setUserInfo] = useState({
    email: "",
    photoURL: "",
    displayName: "",
  });
  const [notifications, setNotifications] = useState(0);

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setUserInfo({
          email: currentUser.email || "No Email",
          photoURL: currentUser.photoURL || "",
          displayName: currentUser.displayName || "User", 
        });
      } else {
        setUser(null);
        setUserInfo({ email: "", photoURL: "", displayName: "" });
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let fetchIntervalId; 
    let timeLeftIntervalId; 

    const calculateTimeLeft = (uploadTime) => {
      const uploadDate = new Date(uploadTime);
      const expirationDate = new Date(
        uploadDate.getTime() + 24 * 60 * 60 * 1000
      ); // +24 hours
      const now = new Date();

      const diffInMs = expirationDate - now;
      if (diffInMs <= 0) return "Expired";

      const hours = Math.floor(diffInMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    };

    const fetchFiles = async () => {
      if (!user) return; 

      try {
        const token = await user.getIdToken(true); 
        

        const response = await axios.get(`https://scan2print-app.onrender.com/files`, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        setLoading(false);

        const formattedRows = response.data.map((file) => {
          const rawDate = new Date(file.timeofupload); 
          const formattedDate = new Intl.DateTimeFormat("en-IN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: "Asia/Kolkata",
          }).format(rawDate);

          return {
            id: file._id,
            filename: file.filename,
            customername: file.sentby || "Unknown Customer",
            filetype: file.mimetype.split("/")[1].toUpperCase(),
            uploadtime: formattedDate,
            timeofupload: file.timeofupload, 
            timeleft: calculateTimeLeft(file.timeofupload),
            status: file.status,
            viewed:false
          };
        });
        // Count files with status 'pending'
        const pendingFilesCount = formattedRows.filter(
          (file) => file.status === "pending"
        ).length;

        // console.log("Pending",pendingFilesCount);

        setNotifications(pendingFilesCount);
        setRows((prevRows) => {
          // Add only new rows
          const newRows = formattedRows.filter(
            (newFile) => !prevRows.some((row) => row.id === newFile.id)
          );
          if (newRows.length === 0) return prevRows; // Avoid state update if no new row
          return [...prevRows, ...newRows];
        });

        // console.log("Files fetched successfully:", formattedRows);
      } catch (error) {
        console.error(
          "Error fetching files:",
          error.response ? error.response.data : error.message
        );
      }
    };

    const updateTimeLeft = () => {
      setRows((prevRows) =>
        prevRows.map((row) => ({
          ...row,
          timeleft: calculateTimeLeft(row.timeofupload),
        }))
      );
    };

    if (user) {
      fetchFiles(); // Fetch files immediately on component mount

      // Start polling for file updates
      fetchIntervalId = setInterval(fetchFiles, 5000);

      // Start updating timeleft dynamically every minute
      timeLeftIntervalId = setInterval(updateTimeLeft, 60000); // 60 seconds
    }

    // Cleanup function to clear the intervals
    return () => {
      if (fetchIntervalId) clearInterval(fetchIntervalId);
      if (timeLeftIntervalId) clearInterval(timeLeftIntervalId);
    };
  }, [user]);

  return (
    <div className="App">
      <Container disableGutters maxWidth="xl" sx={{ padding: 0, margin: 0 }}>
        <Router>
          <Routes>
            <Route
              path="/"
              element={user ? <Navigate to="/dashboard" /> : <SignIn />}
            />
            <Route element={<Layout userInfo={userInfo} notifications={notifications}/>}>
              {" "}
              {/* Wrap these routes with Layout */}
              <Route
                path="/dashboard"
                element={
                  user ? (
                    <DashboardMain rows={rows} setRows={setRows} setNotifications={setNotifications} loading={loading}/>
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route
                path="/qr-code"
                element={
                  user ? (
                    <ManageQRCode userInfo={userInfo} />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
           
            </Route>
          </Routes>
        </Router>

      </Container>
    </div>
  );
}

export default App;
