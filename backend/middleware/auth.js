const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Hardcoded tokens for demo purposes
const DEMO_TOKENS = {
  viewer: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ2aWV3ZXJfMTIzIiwicm9sZSI6InZpZXdlciIsImVtYWlsIjoidmlld2VyQHBlcmNlaXZlbm93LmNvbSIsImlhdCI6MTY5MDAwMDAwMH0.demo-token-viewer',
  reviewer: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJyZXZpZXdlcl8xMjMiLCJyb2xlIjoicmV2aWV3ZXIiLCJlbWFpbCI6InJldmlld2VyQHBlcmNlaXZlbm93LmNvbSIsImlhdCI6MTY5MDAwMDAwMH0.demo-token-reviewer'
};

// Mock user data
const MOCK_USERS = {
  viewer_123: {
    id: 'viewer_123',
    email: 'viewer@perceivenow.com',
    role: 'viewer',
    name: 'John Viewer'
  },
  reviewer_123: {
    id: 'reviewer_123',
    email: 'reviewer@perceivenow.com',
    role: 'reviewer',
    name: 'Jane Reviewer'
  }
};

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      userId: user.id, 
      role: user.role, 
      email: user.email 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    // For demo purposes, check hardcoded tokens first
    if (token === DEMO_TOKENS.viewer) {
      return { userId: 'viewer_123', role: 'viewer', email: 'viewer@perceivenow.com' };
    }
    if (token === DEMO_TOKENS.reviewer) {
      return { userId: 'reviewer_123', role: 'reviewer', email: 'reviewer@perceivenow.com' };
    }
    
    // Otherwise verify with JWT
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: 'Access token required',
      requestId: req.requestId
    });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ 
      error: 'Invalid or expired token',
      requestId: req.requestId
    });
  }

  req.user = decoded;
  next();
};

// Authorization middleware for specific roles
const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        requestId: req.requestId
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        requestId: req.requestId,
        required: roles,
        current: req.user.role
      });
    }

    next();
  };
};

// Optional auth middleware (doesn't fail if no token)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      req.user = decoded;
    }
  }

  next();
};

module.exports = {
  generateToken,
  verifyToken,
  authenticateToken,
  authorize,
  optionalAuth,
  MOCK_USERS,
  DEMO_TOKENS
};