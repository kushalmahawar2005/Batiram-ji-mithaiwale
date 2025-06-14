import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Box,
  Typography,
  Paper,
  Container,
  Button,
  TextField,
  Grid,
} from '@mui/material';
import './Checkout.css';

const Checkout = ({ total, items }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePayment = async () => {
    try {
      // Validate form
      if (!formData.name || !formData.email || !formData.phone || !formData.address) {
        toast.error('Please fill all required fields');
        return;
      }

      // Create order on your server (simulated here)
      const orderId = 'order_' + Math.random().toString(36).substr(2, 9);
      
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: total * 100, // Convert to paise
        currency: 'INR',
        name: 'BMW E-Commerce',
        description: 'Payment for your order',
        order_id: orderId,
        handler: function (response) {
          // Handle successful payment
          const orderData = {
            id: orderId,
            date: new Date().toISOString(),
            items: items,
          amount: total,
            status: 'completed',
            paymentId: response.razorpay_payment_id,
            customerDetails: formData,
          };

          // Save order to localStorage
          const orders = JSON.parse(localStorage.getItem('orders') || '[]');
          orders.push(orderData);
          localStorage.setItem('orders', JSON.stringify(orders));

          toast.success('Payment successful!');
          navigate('/orders');
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#0066B1',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response) {
        toast.error('Payment failed: ' + response.error.description);
      });
      razorpay.open();
    } catch (error) {
      toast.error('Error processing payment: ' + error.message);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Order Summary
              </Typography>
              {items.map((item) => (
                <Box key={item.id} sx={{ mb: 2 }}>
                  <Typography variant="body1">
                    {item.name} x {item.quantity}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ₹{item.price.toFixed(2)}
                  </Typography>
                </Box>
              ))}
              <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                <Typography variant="h6">
                  Total: ₹{total.toFixed(2)}
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Shipping Details
              </Typography>
              <Box component="form" sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
            required
                  sx={{ mb: 2 }}
          />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
            type="email"
                  value={formData.email}
                  onChange={handleInputChange}
            required
                  sx={{ mb: 2 }}
          />
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
            type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
            required
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  multiline
                  rows={3}
                  value={formData.address}
                  onChange={handleInputChange}
            required
                  sx={{ mb: 2 }}
          />
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handlePayment}
                  size="large"
      >
                  Pay ₹{total.toFixed(2)}
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Checkout; 