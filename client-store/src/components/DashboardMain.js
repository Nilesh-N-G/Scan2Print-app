import React from "react";
import FileTable from "./FileTable";
import { Box } from "@mui/material";
import Footer from "./Footer";
function DashboardMain({ rows, setRows,setNotifications,loading }) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          mt: 1,
        }}
      >
        <Box
          sx={{
            width: "100%",
            paddingX: {
              xs: 1,
              sm: 1,
              md: 5,
            }
          }}
        >
          <FileTable rows={rows} setRows={setRows} setNotifications={setNotifications} loading={loading} />
        </Box>
      </Box>
      <Footer/>
    </>
  );
}

export default DashboardMain;
