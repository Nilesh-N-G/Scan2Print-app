import React, { useState ,useEffect} from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Grid, Box, IconButton, Drawer, List, ListItem, ListItemText ,  Snackbar,
  Alert} from '@mui/material';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import '../App.css'; // Make sure to include global CSS file for fonts
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';
import img1 from '../assets/images/qrcode.webp'
import img2 from '../assets/images/tempstorage.webp'
import img3 from '../assets/images/dashboard.webp'
function Homepage() {
  const [loading, setLoading] = useState(false);


  const handleScrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  

  // Google Login Handler
  const handleGoogleLogin = async () => {
    setLoading(true);
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      const token = await auth.currentUser.getIdToken(true);
      // console.log(token);
      const response = await axios.post("https://scan2print-app.onrender.com/auth/login",{}, {
        headers: {
          Authorization: `Bearer ${token}`, // Set the Authorization header
        },
      });
      // console.log('Login Successful',response);
    } catch (error) {
      console.error('Login Error:', error);
    }
    finally {
      setLoading(false); // Ensure loading is set to false regardless of success or failure
    }
  };

  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (state) => () => {
    setDrawerOpen(state);
  };


  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Check initial connection state
    setIsOffline(!navigator.onLine);

    // Add event listeners for online and offline events
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);


  return (
    <div style={{ margin: 0, padding: 0 }}>

      {/* Alert for Offline Status */}
      <Snackbar
        open={isOffline}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={6000}
      >
        <Alert severity="warning" sx={{ width: '100%' }}>
          You are offline. Please check your network connection!
        </Alert>
      </Snackbar>
      {/* Header Section */}
      <AppBar position="sticky" sx={{ backgroundColor: '#0077b6', margin: 0, padding: 0 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            letterSpacing: 2,
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          Scan2Print
        </Typography>

        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
          <Button sx={{ color: 'white', fontWeight: 500, fontFamily: 'Poppins, sans-serif' }} href="#feature" onClick={handleScrollToFeatures}>
            Features
          </Button>
          <Button sx={{ color: 'white', fontWeight: 500, fontFamily: 'Poppins, sans-serif' }} href="#about" onClick={handleScrollToFeatures}>
            About
          </Button>
          <Button
            sx={{ color: 'white', fontWeight: 500, fontFamily: 'Poppins, sans-serif' }}
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Login'}
          </Button>
        </Box>

        {/* Mobile Navigation (Hamburger Menu) */}
        <IconButton
          sx={{ display: { xs: 'block', md: 'none' }, color: 'white' }}
          onClick={toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      {/* Drawer for Mobile Navigation */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{ sx: { width: '250px' } }}
      >
        <List>
          <ListItem button component="a" href="#features" onClick={toggleDrawer(false)}>
            <ListItemText primary="Features"  onClick={handleScrollToFeatures}/>
          </ListItem>
          <ListItem button component="a" href="#about" onClick={toggleDrawer(false)}>
            <ListItemText primary="About"  onClick={handleScrollToFeatures}/>
          </ListItem>
          <ListItem button onClick={handleGoogleLogin} disabled={loading}>
            <ListItemText primary={loading ? 'Loading...' : 'Login'} />
          </ListItem>
        </List>
      </Drawer>
    </AppBar>

      {/* Hero Section */}
      <Box sx={{ background: 'linear-gradient(135deg, #0077b6, #0096c7)', color: 'white', py: 10, textAlign: 'center', margin: 0 }}>
      
        <Typography variant="h2" sx={{ fontWeight: 700, mb: 3, textShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)', fontFamily: 'Poppins, sans-serif' }}>
          Fast, Simple Document Sharing for Printing
        </Typography>
        <Typography variant="h5" sx={{ mb: 3, fontFamily: 'Roboto, sans-serif' }}>
          Scan a QR code to send your files directly to a print shop. No more emails, no more delays!
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#ffdd00',
            color: '#333',
            borderRadius: '50px',
            fontWeight: 600,
            textTransform: 'uppercase',
            px: 5,
            py: 2,
            fontSize: '1.1em',
            '&:hover': {
              backgroundColor: '#ffcc00',
            },
          }}
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Get Started'}
        </Button>
      </Box>

      {/* Features Section */}
      <Container id="features" sx={{ py: 8, backgroundColor: '#f7f7f7', maxWidth: '100%' }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center', p: 4, backgroundColor: 'white', borderRadius: 2, boxShadow: 3 }}>
              <img src={img1} alt="QR Code Sharing" style={{ width: '80px', marginBottom: '20px' }} />
              <Typography variant="h5" sx={{ mb: 2, fontFamily: 'Poppins, sans-serif' }}>
                QR Code Sharing
              </Typography>
              <Typography sx={{ color: '#777', fontFamily: 'Roboto, sans-serif' }}>
                Scan a QR code to quickly upload your documents for printing.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center', p: 4, backgroundColor: 'white', borderRadius: 2, boxShadow: 3 }}>
              <img src={img2} alt="Temporary Storage" style={{ width: '80px', marginBottom: '20px' }} />
              <Typography variant="h5" sx={{ mb: 2, fontFamily: 'Poppins, sans-serif' }}>
                Temporary Storage
              </Typography>
              <Typography sx={{ color: '#777', fontFamily: 'Roboto, sans-serif' }}>
                Files are securely stored temporarily to ensure privacy.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center', p: 4, backgroundColor: 'white', borderRadius: 2, boxShadow: 3 }}>
              <img src={img3} alt="Dashboard Management" style={{ width: '80px', marginBottom: '20px' }} />
              <Typography variant="h5" sx={{ mb: 2, fontFamily: 'Poppins, sans-serif' }}>
                Easy Dashboard
              </Typography>
              <Typography sx={{ color: '#777', fontFamily: 'Roboto, sans-serif' }}>
                Manage incoming requests and track print status with ease.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Footer Section */}
      <Box sx={{ backgroundColor: '#333', color: 'white', py: 2, textAlign: 'center', margin: 0 }}>
        <Typography variant="body2" sx={{ fontFamily: 'Roboto, sans-serif' }}>
          &copy; 2024 Scan2Print. All rights reserved.
        </Typography>
      </Box>
    </div>
  );
}

export default Homepage;
