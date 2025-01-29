import React, { useState, useEffect } from 'react';
import './App.css';
import { debounce } from 'lodash';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

function App() {
  const [xData, setXData] = useState("1,2,3,4,5");  // Input as a string, will convert to array
  const [yData, setYData] = useState("1,4,9,16,25"); // Input as a string, will convert to array
  const [imageSrc, setImageSrc] = useState(null);

  // Debounced function to fetch the plot
  const fetchPlot = debounce(async (x, y) => {
    // Convert the string inputs into arrays of numbers
    const xArray = x.split(',').map(Number);
    const yArray = y.split(',').map(Number);

    if (xArray.length === 0 || yArray.length === 0) {
      alert('Please enter valid data');
      return;
    }

    const response = await fetch('https://backend-plotter.vercel.app/plot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ x: xArray, y: yArray }),
    });

    if (response.ok) {
      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setImageSrc(imageUrl);
    } else {
      alert('Error: Unable to fetch the plot');
    }
  }, 1500); // Debounce delay of 1.5 seconds

  useEffect(() => {
    // Call the debounced function whenever xData or yData changes
    fetchPlot(xData, yData);
  }, [xData, yData, fetchPlot]);  // Re-run when either xData or yData changes

  return (
    <Container maxWidth="sm" style={{ padding: '20px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Plotting Data with Flask and React
      </Typography>
      
      <Box mb={2}>
        <TextField
          label="X Data (comma-separated)"
          variant="outlined"
          fullWidth
          value={xData}
          onChange={(e) => setXData(e.target.value)}
          placeholder="Enter X data"
          style={{ marginBottom: '20px' }}
        />
      </Box>

      <Box mb={2}>
        <TextField
          label="Y Data (comma-separated)"
          variant="outlined"
          fullWidth
          value={yData}
          onChange={(e) => setYData(e.target.value)}
          placeholder="Enter Y data"
          style={{ marginBottom: '20px' }}
        />
      </Box>

    

      {imageSrc && (
        <Box textAlign="center">
          <img src={imageSrc} alt="Plot" style={{ maxWidth: '100%', maxHeight: '400px' }} />
        </Box>
      )}
    </Container>
  );
}

export default App;
