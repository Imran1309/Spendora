const express = require('express');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { User } = require('../models');

const router = express.Router();

// Store OTPs in memory: { email: { otp, expiresAt } }
const otpStore = {};

// Create transporter
const createTransporter = () => nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST /forgot-password/send-otp
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No account found with this email' });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    otpStore[email] = { otp, expiresAt };

    // Send email
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Spendora" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🔐 Your Spendora OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; background: #0F0F1A; color: #fff; padding: 40px; border-radius: 16px;">
          <h2 style="color: #7C3AED;">Spendora</h2>
          <h3 style="font-size: 20px;">Password Reset OTP</h3>
          <p style="color: #aaa;">Use the OTP below to reset your password. It expires in <strong>10 minutes</strong>.</p>
          <div style="background: #1E1E2E; border: 2px solid #7C3AED; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
            <span style="font-size: 48px; font-weight: 900; letter-spacing: 12px; color: #7C3AED;">${otp}</span>
          </div>
          <p style="color: #aaa; font-size: 12px;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });

    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST /forgot-password/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = otpStore[email];

    if (!record) return res.status(400).json({ message: 'OTP not found. Please request again.' });
    if (Date.now() > record.expiresAt) {
      delete otpStore[email];
      return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
    }
    if (record.otp !== otp) return res.status(400).json({ message: 'Invalid OTP. Please try again.' });

    res.json({ message: 'OTP verified', verified: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST /forgot-password/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const record = otpStore[email];

    if (!record) return res.status(400).json({ message: 'OTP not found. Please request again.' });
    if (Date.now() > record.expiresAt) {
      delete otpStore[email];
      return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
    }
    if (record.otp !== otp) return res.status(400).json({ message: 'Invalid OTP.' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);

    await User.findOneAndUpdate({ email }, { password: hashed });
    delete otpStore[email];

    res.json({ message: 'Password reset successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
