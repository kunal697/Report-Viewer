const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const reportsRouter = require('./routes/reports');
const feedbackRouter = require('./routes/feedback');
const authRouter = require('./routes/auth');
const { requestLogger, errorHandler } = require('./middleware/logger');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors());

// Request logging
app.use(morgan('combined'));
app.use(requestLogger);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/auth', authRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/feedback', feedbackRouter);


app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Perceive Now server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});


module.exports = app;