import express from 'express';
import {conn}from '../connection'
const app =express()
const verifyapi =app.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;
  
    // Query user table to check if OTP is valid
    const query = 'SELECT * FROM customer WHERE email = ? AND verifycode = ? ';
    conn.query(query, [email, otp], (error, results) => {
      if (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Failed to verify OTP' });
      } else {
        if (results.length > 0) {
          // OTP verification successful
          res.status(200).json({ message: 'OTP verified successfully' });
        } else {
          // OTP verification failed
          res.status(400).json({ message: 'Invalid OTP' });
        }
      }
    });
  });
  export default verifyapi