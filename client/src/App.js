import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#D4AF37', // Gold color
    },
    secondary: {
      main: '#8B0000', // Deep red
    },
    background: {
      default: '#FFF8DC', // Cream white
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<div>Welcome to Bastiramji Mithai Wale</div>} />
          </Routes>
          <ToastContainer position="top-right" />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App; 