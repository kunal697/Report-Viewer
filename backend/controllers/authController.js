const { generateToken, MOCK_USERS, DEMO_TOKENS } = require('../middleware/auth');

// POST /api/auth/login
function login(req, res) {
  try {
    const { email, password, role } = req.body;
    const demoCredentials = {
      'viewer@perceivenow.com': { password: 'viewer123', role: 'viewer' },
      'reviewer@perceivenow.com': { password: 'reviewer123', role: 'reviewer' }
    };
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
        requestId: req.requestId,
        timestamp: new Date().toISOString()
      });
    }
    const userCreds = demoCredentials[email];
    if (!userCreds || userCreds.password !== password) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        requestId: req.requestId,
        timestamp: new Date().toISOString()
      });
    }
    const userId = userCreds.role === 'viewer' ? 'viewer_123' : 'reviewer_123';
    const user = MOCK_USERS[userId];
    if (!user) {
      return res.status(500).json({
        success: false,
        error: 'User data not found',
        requestId: req.requestId,
        timestamp: new Date().toISOString()
      });
    }
    const token = generateToken(user);
    const demoToken = userCreds.role === 'viewer' ? DEMO_TOKENS.viewer : DEMO_TOKENS.reviewer;
    res.json({
      success: true,
      data: {
        token: demoToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        expiresIn: '24h'
      },
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Login failed',
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    });
  }
}

// POST /api/auth/demo-tokens
function demoTokens(req, res) {
  try {
    res.json({
      success: true,
      data: {
        tokens: DEMO_TOKENS,
        users: {
          viewer: MOCK_USERS.viewer_123,
          reviewer: MOCK_USERS.reviewer_123
        },
        instructions: {
          viewer: 'Use this token to test viewer functionality',
          reviewer: 'Use this token to test reviewer functionality (can view feedback)',
          usage: 'Add header: Authorization: Bearer <token>'
        }
      },
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get demo tokens',
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    });
  }
}

// GET /api/auth/verify
function verify(req, res) {
  try {
    const user = MOCK_USERS[req.user.userId];
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        requestId: req.requestId,
        timestamp: new Date().toISOString()
      });
    }
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        tokenInfo: {
          userId: req.user.userId,
          role: req.user.role,
          email: req.user.email
        }
      },
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Token verification failed',
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    });
  }
}

// POST /api/auth/logout
function logout(req, res) {
  try {
    res.json({
      success: true,
      message: 'Logged out successfully',
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Logout failed',
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = {
  login,
  demoTokens,
  verify,
  logout
}; 