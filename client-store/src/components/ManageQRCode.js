import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, CircularProgress } from '@mui/material';
import { Box, Link,Button } from '@mui/material';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import Footer from './Footer';

const ManageQRCode = ({ userInfo }) => {
  const [email] = useState(userInfo.email);
  const [qrCodeUrl, setQRCodeUrl] = useState('');
  const [Url, CodeUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = useCallback(async () => {
    setLoading(true); // Start loading
    const user = getAuth().currentUser;
    const token = await user.getIdToken(true);

    try {
      // console.log(token);
      const response = await axios.get('https://scan2print-app-tzor.onrender.com/qr/generate', {
        params: { email },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setQRCodeUrl(response.data.qrCodeDataUrl);
      CodeUrl(response.data.uploadPageUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  }, [email]);

  useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  const handlePrint = () => {
    const printContent = document.getElementById('print-container').innerHTML;
    const printWindow = window.open('', '_blank'); // Open a new blank tab/window
  
    // Add the content to the new window
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Code</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              margin: 20px;
            }
            img {
              max-width: 100%;
            }
            a {
              color: blue;
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
  
    // Trigger the print functionality
    printWindow.print();
  
    // Close the print window after printing
    printWindow.onafterprint = () => {
      printWindow.close();
    };
  };
  

  return (<>
    <Container id="print-container" maxWidth="sm">
      <Box textAlign="center" mt={4}>
        <Typography variant="h4" gutterBottom>
          QR Code
        </Typography>

        {loading ? (
          <Box mt={4}>
            <CircularProgress />
            <Typography variant="body1" mt={2}>
              Generating QR code, please wait...
            </Typography>
          </Box>
        ) : qrCodeUrl ? (
          <Box mt={4}>
            <img
              src={qrCodeUrl}
              alt="Generated QR Code"
              style={{ width: '200px', height: '200px' }}
            />
            <Typography variant="body1" mt={2}>
              Scan this QR code to upload files
            </Typography>
            <Typography variant="body1" mt={2}>
            <Link href={Url} target="_blank" rel="noopener noreferrer">
            {Url}
            </Link>
            </Typography>
          </Box>
        ) : (
          <Typography variant="body1" mt={4} color="error">
            Unable to generate QR code. Please try again later.
          </Typography>
        )}
      </Box>


     
    </Container>

    <Box textAlign="center" mt={4} mb={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePrint}
        >
          Print QR Code
        </Button>
      </Box>
    <Footer/>
    </>
  );
};

export default ManageQRCode;
