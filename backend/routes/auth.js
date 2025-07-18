const express = require('express');
const { login, demoTokens, verify, logout } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login - Demo login endpoint
router.post('/login', login);

// POST /api/auth/demo-tokens - Get demo tokens for testing
router.post('/demo-tokens', demoTokens);

// GET /api/auth/verify - Verify token and get user info
router.get('/verify', authenticateToken, verify);

// POST /api/auth/logout - Logout endpoint (for completeness)
router.post('/logout', authenticateToken, logout);

module.exports = router;