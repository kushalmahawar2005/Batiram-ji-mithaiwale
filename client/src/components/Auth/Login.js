import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
} from '@mui/material';

const Login = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');

  const generateOTP = () => {
    // Generate a 6-digit OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setShowOtpInput(true);
    toast.success('OTP sent successfully!');
  };

  const verifyOTP = () => {
    if (otp === generatedOtp) {
      // Store login info in localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userPhone', phone);
      toast.success('Login successful!');
      navigate('/orders');
    } else {
      toast.error('Invalid OTP!');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Login
          </Typography>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Phone Number"
              variant="outlined"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              type="tel"
              pattern="[0-9]{10}"
              sx={{ mb: 2 }}
            />
            {!showOtpInput ? (
              <Button
                fullWidth
                variant="contained"
                onClick={generateOTP}
                disabled={!phone || phone.length !== 10}
              >
                Send OTP
              </Button>
            ) : (
              <>
                <TextField
                  fullWidth
                  label="Enter OTP"
                  variant="outlined"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  type="number"
                  sx={{ mb: 2 }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  onClick={verifyOTP}
                  disabled={!otp || otp.length !== 6}
                >
                  Verify OTP
                </Button>
              </>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 