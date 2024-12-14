import React from "react";
import { Box, Typography } from "@mui/material";

function Footer() {
  return (
    <>
      <Box
        sx={{
          backgroundColor: "#F2F5F5",
          color: "black",
          py: 1,
          textAlign: "center",
          margin: 0,
          position: "fixed",
          bottom: 0,
          width: "100vw",
        }}
      >
        <Typography variant="body2" sx={{ fontFamily: "Roboto, sans-serif" }}>
          &copy; 2024 Scan2Print. All rights reserved.
        </Typography>
      </Box>
    </>
  );
}

export default Footer;
