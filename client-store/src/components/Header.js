import React, { useState } from "react";
import {
  Badge,
  IconButton,
  Toolbar,
  Typography,
  Divider,
  Box,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo2.jpg";

function Header({ userInfo, notifications }) {
  // console.log(userInfo);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // console.log("User logged out");
        navigate("/");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const menuItems = [
    { text: "Dashboard", action: () => navigate("/dashboard") },
    { text: "QR Code", action: () => navigate("/qr-code") },
    { text: "Log Out", action: handleLogout },
  ];

  return (
    <>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: isMobile ? "space-between" : "space-between",
          alignItems: "center",
          backgroundColor: '#F8FAFA',
          p: isMobile ? 1 : 2,
        }}
      >
        {/* Logo and Title */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <img src={logo} alt="Scan2Print" width="40" />
          <Typography
            variant="h6"
            sx={{
              ml: 1,
              fontWeight: "bold",
            }}
          >
            Scan2Print
          </Typography>
        </Box>

        {isMobile ? (
          <>
            {/* Hamburger Menu Icon */}
            <IconButton onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>

            {/* Drawer */}
            <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
              <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
              >
                <List>
                  {menuItems.map((item, index) => (
                    <ListItem button key={index} onClick={item.action}>
                      <ListItemText primary={item.text} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Drawer>
          </>
        ) : (
          /* Full Menu for Larger Screens */
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {menuItems.slice(0, 2).map((item, index) => (
              <IconButton sx={{ borderRadius: "20px" }} key={index} onClick={item.action}>
                <Typography variant="subtitle1" sx={{ color: "black" }}>
                  {item.text}
                </Typography>
              </IconButton>
            ))}
            <IconButton sx={{ borderRadius: "20px" }} onClick={handleLogout}>
              <Typography variant="subtitle1" sx={{ color: "black" }}>
                Log Out
              </Typography>
            </IconButton>
            <IconButton onClick={() => navigate("/dashboard")}>
              <Badge badgeContent={notifications} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton>
              {userInfo.photoURL ? (
                <Box
                  component="img"
                  src={userInfo.photoURL}
                  alt={userInfo.displayName || "User"}
                  sx={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                  }}
                />
              ) : (
                <AccountCircleIcon sx={{ fontSize: 40, color: "#aaa" }} />
              )}
            </IconButton>
          </Box>
        )}
      </Toolbar>
      <Divider />
    </>
  );
}

export default Header;
