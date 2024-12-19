import { getAuth } from 'firebase/auth';
import { Button } from "@mui/material";
import React, { useEffect,useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import axios from 'axios';
import "../App.css"; // Import custom CSS

// Function to calculate time left
const calculateTimeLeft = (uploadTime) => {
  const uploadDate = new Date(uploadTime);
  const expirationDate = new Date(uploadDate.getTime() + 24 * 60 * 60 * 1000); // 24 hours
  const now = new Date();
  const istNow = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
  

  const diffInMs = expirationDate - istNow;
  if (diffInMs <= 0) return "Expired";

  const hours = Math.floor(diffInMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

function FileTable({ rows, setRows ,setNotifications ,loading}) {
  
  const updateRecentHistory = async (operation, filename, token) => {
    try {
      // console.log("Updating recent history")
      const response = await axios.post(
        'https://scan2print-app.onrender.com/history/update',
        { operation, filename },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the Firebase token
          },
        }
      );
      // console.log('Recent history updated:', response.data);
    } catch (error) {
      if (error.response) {
        console.error('Error updating recent history:', error.response.data);
      } else {
        console.error('Error making API call:', error.message);
      }
    }
  };

  const paginationModel = { page: 0, pageSize: 10 };

 // Memoize the function to avoid recreating it on every render
 const removeExpiredFiles = useCallback(() => {
  setRows((prevRows) => {
    return prevRows.filter((row) => {
      const timeLeft = calculateTimeLeft(row.timeofupload);
      return timeLeft !== "Expired"; // Keep only non-expired files
    });
  });
}, [setRows]);

// Periodically remove expired files every minute (for dynamic cleanup)
useEffect(() => {
  const intervalId = setInterval(removeExpiredFiles, 6000); // 60 seconds

  return () => clearInterval(intervalId);
}, [removeExpiredFiles]); // Now safely included as a dependency

  const columns = [
    { field: "filename", headerName: "File Name", width: 320 },
    { field: "customername", headerName: "Customer Name", width: 220 },
    { field: "filetype", headerName: "File Type", width: 120 },
    { field: "timeleft", headerName: "Time Left", width: 140 },
    { field: "uploadtime", headerName: "Upload Time", width: 200 },
    {
      field: "status",
      headerName: "Status",
      width: 140,
      renderCell: (params) => {
        // Render the status with custom styles based on its value
        let status = params.row.status || 'Pending';
        // console.log('Status',status);

        if (status === 'pending' && params.row.viewed){
          status = 'viewed';
        }
    
        let statusStyle = {};

          statusStyle = { backgroundColor: "transparent", padding: "4px 8px", borderRadius: "4px" };
        
    
        return (
          <div style={statusStyle}>
            {status.charAt(0).toUpperCase() + status.slice(1)} {/* Capitalize the first letter */}
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 250,
      renderCell: (params) => {
        const handleActionClick = async (actionType) => {
          const fileId = params.row.id;
          const fileName = params.row.filename;
          const user = getAuth().currentUser;
          // console.log(params.row.status)
          if(params.row.status === "pending") {
            setNotifications((prevNotifications) => Math.max(prevNotifications - 1, 0));
          }

          if (!user) {
            alert("User is not authenticated");
            return;
          }

          const token = await user.getIdToken(true);

          try {
            if (actionType === "View") {
              const newTab = window.open('', '_blank');
              if (!newTab) {
                alert("Failed to open new tab");
                return;
              }try {
                const response = await axios.get(`https://scan2print-app.onrender.com/files/${fileId}`, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                  params: {
                    operation:'view'
                  },
                  responseType: 'blob', // Ensure we receive binary data
                });
              
                // If the request is successful, response.data contains the file
                const fileBlob = response.data;
                const fileURL = URL.createObjectURL(fileBlob);
                newTab.location.href = fileURL;
              
                // Mark the row as viewed
                setRows((prevRows) =>
                  prevRows.map((row) =>
                    row.id === fileId ? { ...row, viewed: true } : row
                  )
                );
              } catch (error) {
                // Handle errors, such as network issues or non-2xx status codes
                alert("Error fetching the file");
                console.error(error); // For debugging
                newTab.close();
              }
             
            } else if (actionType === "Print") {
              try {
                const response = await axios.get(`https://scan2print-app.onrender.com/files/${fileId}`, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                  params: {
                    operation:'print'
                  },
                  responseType: 'blob', // Ensure the response is treated as binary data
                });
            
                // Create a URL for the file blob
                const fileBlob = response.data;
                const fileURL = URL.createObjectURL(fileBlob);
                
            
                const printWindow = window.open(fileURL, '_blank');
                if (!printWindow) {
                  alert("Failed to open print preview");
                  return;
                }
            
                printWindow.onload = () => {
                  printWindow.print();
                };
            
                // Mark the row as printed
                setRows((prevRows) =>
                  prevRows.map((row) =>
                    row.id === fileId ? { ...row, printed: true ,status : 'printed'} : row
                  )
                );
            
                // Update recent history
                updateRecentHistory('print', fileName, token);
              } catch (error) {
                // Handle errors
                alert("Error fetching the file for printing");
                console.error(error); // Log details for debugging
              }
            } else if (actionType === "Delete") {
              try {
                await axios.delete(`https://scan2print-app.onrender.com/files/${fileId}`, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });

                setRows((prevRows) => prevRows.filter((row) => row.id !== fileId));

                alert(`File deleted successfully: ${params.row.filename}`);
                updateRecentHistory('delete', fileName, token);
              } catch (error) {
                console.error('Error deleting file:', error);
                alert('Failed to delete file');
              }
            }
          } catch (error) {
            console.error("Error with action:", error);
            alert("Failed to process the action");
          }
        };

        return (
          <>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => handleActionClick("View")}
              sx={{ mr: 1 }}
            >
              View
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              onClick={() => handleActionClick("Print")}
              sx={{ mr: 1 }}
            >
              Print
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => handleActionClick("Delete")}
            >
              Delete
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <>
      {/* <Typography variant="h6" sx={{ mb: 2, display: 'flex', justifyContent: 'flex-start', mx: 0, p: 0 }}>
        Incoming File Uploads
      </Typography> */}

      <Paper sx={{ height: 450, width: "100%",marginTop:2 }}>
        <DataGrid
          rows={[...rows].reverse()}
          columns={columns}
          loading={loading} 
          getRowClassName={(params) => {
            if (params.row.printed) return "row-printed";
            if (params.row.status === 'printed') return "row-printed";
            if (params.row.status === 'viewed') return "row-viewed";
            if (params.row.viewed) return "row-viewed" 
            
            
            return "";
            
          }}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          sx={{ border: 0 }}
          disableRowSelectionOnClick
        />
      </Paper>
    </>
  );
}

export default FileTable;
