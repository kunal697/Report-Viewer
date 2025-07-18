const express = require('express');
const { submitFeedback, getFeedback, updateFeedbackStatus } = require('../controllers/feedbackController');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// POST /api/feedback - Submit feedback for a report
router.post('/', optionalAuth, submitFeedback);

// GET /api/feedback - Get feedback (for reviewers)
router.get('/', optionalAuth, getFeedback);

// PUT /api/feedback/:id/status - Update feedback status (for reviewers)
router.put('/:id/status', optionalAuth, updateFeedbackStatus);

module.exports = router;