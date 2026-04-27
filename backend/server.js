require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');
const forgotPasswordRoutes = require('./routes/forgotPassword');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/expenses', expenseRoutes);
app.use('/forgot-password', forgotPasswordRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('Spendora Backend API is running with MongoDB');
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/spendora';

// Connect to MongoDB and start server
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully.');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server is live! Listening on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
