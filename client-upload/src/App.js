import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useSearchParams,
} from "react-router-dom";
import axios from "axios";
import {
  Button,
  Typography,
  Container,
  Box,
  TextField,
  LinearProgress,
  Paper,
  IconButton,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import DeleteIcon from "@mui/icons-material/Delete";

const UploadFile = () => {
  const [searchParams] = useSearchParams();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [receivedBy, setReceivedBy] = useState("");
  const [uploadProgress, setUploadProgress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storeid = searchParams.get("storeid");
    if (storeid) setReceivedBy(storeid);
  }, [searchParams]);

  const allowedFileTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
    "image/gif",
  ];

  const onDrop = (acceptedFiles) => {
    const validFiles = acceptedFiles.filter((file) => {
      if (!allowedFileTypes.includes(file.type)) {
        alert(`File ${file.name} is not an allowed type.`);
        return false;
      }

      if (file.size > 25 * 1024 * 1024) {
        // 25 MB in bytes
        alert(`File ${file.name} exceeds the 25 MB size limit.`);
        return false;
      }

      return true;
    });

    if (selectedFiles.length + validFiles.length > 5) {
      alert("You can only select up to 5 files.");
      return;
    }

    setSelectedFiles((prevFiles) => [...prevFiles, ...validFiles]);
    setUploadProgress((prevProgress) => [
      ...prevProgress,
      ...new Array(validFiles.length).fill(0),
    ]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
    setUploadProgress((prevProgress) =>
      prevProgress.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0 || !userName.trim()) {
      alert("Please enter your name and select files.");
      return;
    }

    setLoading(true);
    const newProgress = [...uploadProgress];

    for (let i = 0; i < selectedFiles.length; i++) {
      // console.log(i,selectedFiles.length);
      const formData = new FormData();
      formData.append("files", selectedFiles[i]);
      formData.append("storeid", receivedBy);
      formData.append("name", userName);

      try {
        await axios.post("https://scan2print-app-1.onrender.com/api/files/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            newProgress[i] = percentCompleted;
            setUploadProgress([...newProgress]);
          },
        });

        if (i === selectedFiles.length - 1) {
          alert(`Files uploaded successfully.`);
        }
      } catch (error) {
        console.error(`Error uploading file ${selectedFiles[i].name}:`, error);
        alert(`${error.response.data.error}`);
        window.location.reload();
      }
    }

    setLoading(false);
    window.location.reload();
    setSelectedFiles([]);
    setUploadProgress([]);
    setUserName("");
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          backgroundColor: "#f9f9f9",
          padding: 4,
          borderRadius: 2,
          boxShadow: 2,
          marginTop: 10,
        }}
      >
        <Typography variant="h5" textAlign="center" gutterBottom>
          Upload Files for Printing
        </Typography>
        <TextField
          label="Your Name"
          fullWidth
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          margin="normal"
          required
        />
        <div
          {...getRootProps()}
          style={{
            border: "2px dashed #ccc",
            padding: "20px",
            textAlign: "center",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          <input {...getInputProps()} />
          <Typography>
            Click to select files or drag and drop files here
          </Typography>
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={loading || selectedFiles.length === 0 || !userName.trim()}
          fullWidth
        >
          {loading ? "Uploading..." : "Upload for Printing"}
        </Button>

        {selectedFiles.map((file, index) => (
          <Paper key={index} elevation={2} sx={{ padding: 2, marginTop: 2 }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="body1" gutterBottom>
                {file.name}
              </Typography>
              <IconButton
                color="error"
                onClick={() => handleRemoveFile(index)}
                aria-label="remove file"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
            <LinearProgress
              variant="determinate"
              value={uploadProgress[index] || 0}
              sx={{ marginBottom: 1 }}
            />
            <Typography variant="caption">
              {uploadProgress[index] || 0}%
            </Typography>
          </Paper>
        ))}
      </Box>
    </Container>
  );
};

const UploadFilewithStoreID = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [receivedBy, setReceivedBy] = useState(""); // storeid
  const [userName, setUserName] = useState("");
  const [uploadProgress, setUploadProgress] = useState([]);
  const [loading, setLoading] = useState(false);

  const allowedFileTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
    "image/gif",
  ];

  const onDrop = (acceptedFiles) => {
    const validFiles = acceptedFiles.filter((file) => {
      if (!allowedFileTypes.includes(file.type)) {
        alert(`File ${file.name} is not an allowed type.`);
        return false;
      }

      if (file.size > 25 * 1024 * 1024) {
        alert(`File ${file.name} exceeds the 25 MB size limit.`);
        return false;
      }

      return true;
    });

    if (selectedFiles.length + validFiles.length > 5) {
      alert("You can only select up to 5 files.");
      return;
    }

    setSelectedFiles((prevFiles) => [...prevFiles, ...validFiles]);
    setUploadProgress((prevProgress) => [
      ...prevProgress,
      ...new Array(validFiles.length).fill(0),
    ]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
    setUploadProgress((prevProgress) =>
      prevProgress.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0 || !userName.trim() || !receivedBy.trim()) {
      alert("Please enter your name, store ID, and select files.");
      return;
    }

    setLoading(true);
    const newProgress = [...uploadProgress];

    for (let i = 0; i < selectedFiles.length; i++) {
      const formData = new FormData();
      formData.append("files", selectedFiles[i]);
      formData.append("storeid", receivedBy); // send storeid
      formData.append("name", userName);

      try {
        await axios.post("https://scan2print-app-1.onrender.com/api/files/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            newProgress[i] = percentCompleted;
            setUploadProgress([...newProgress]);
          },
        });

        if (i === selectedFiles.length - 1) {
          alert("Files uploaded successfully.");
        }
      } catch (error) {
        console.error(`Error uploading file ${selectedFiles[i].name}:`, error);
        alert(`${error.response.data.error}`);
        window.location.reload();
      }
    }

    setLoading(false);
    window.location.reload();
    setSelectedFiles([]);
    setUploadProgress([]);
    setUserName("");
    setReceivedBy(""); // reset storeid
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          backgroundColor: "#f9f9f9",
          padding: 4,
          borderRadius: 2,
          boxShadow: 2,
          marginTop: 10,
        }}
      >
        <Typography variant="h5" textAlign="center" gutterBottom>
          Upload Files for Printing
        </Typography>
        <TextField
          label="Store ID"
          fullWidth
          value={receivedBy}
          onChange={(e) => setReceivedBy(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          label="Your Name"
          fullWidth
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          margin="normal"
          required
        />

        <div
          {...getRootProps()}
          style={{
            border: "2px dashed #ccc",
            padding: "20px",
            textAlign: "center",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          <input {...getInputProps()} />
          <Typography>
            Click to select files or drag and drop files here
          </Typography>
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={
            loading ||
            selectedFiles.length === 0 ||
            !userName.trim() ||
            !receivedBy.trim()
          }
          fullWidth
        >
          {loading ? "Uploading..." : "Upload for Printing"}
        </Button>

        {selectedFiles.map((file, index) => (
          <Paper key={index} elevation={2} sx={{ padding: 2, marginTop: 2 }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="body1" gutterBottom>
                {file.name}
              </Typography>
              <IconButton
                color="error"
                onClick={() => handleRemoveFile(index)}
                aria-label="remove file"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
            <LinearProgress
              variant="determinate"
              value={uploadProgress[index] || 0}
              sx={{ marginBottom: 1 }}
            />
            <Typography variant="caption">
              {uploadProgress[index] || 0}%
            </Typography>
          </Paper>
        ))}
      </Box>
    </Container>
  );
};

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<UploadFilewithStoreID />} />
      <Route path="/upload" element={<UploadFile />} />
    </Routes>
  </Router>
);

export default App;
