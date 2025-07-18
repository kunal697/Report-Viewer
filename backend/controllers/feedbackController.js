const MOCK_REPORTS = require('../data/mockdata.json');
let MOCK_FEEDBACK = [];

// Helper: get report by ID
function getReportById(id) {
  return MOCK_REPORTS.find(report => report.id === id);
}

// POST /api/feedback - Submit feedback for a report
function submitFeedback(req, res) {
  try {
    const { reportId, userComment, flaggedSection, feedbackType, rating } = req.body;
    if (!reportId || !userComment) {
      return res.status(400).json({
        success: false,
        error: 'reportId and userComment are required',
        requestId: req.requestId,
        timestamp: new Date().toISOString()
      });
    }
    const report = getReportById(reportId);
    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found',
        requestId: req.requestId,
        timestamp: new Date().toISOString()
      });
    }
    const feedback = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      reportId,
      userComment,
      flaggedSection: flaggedSection || null,
      feedbackType: feedbackType || 'general',
      rating: rating || null,
      userId: req.user?.userId || 'anonymous',
      userRole: req.user?.role || 'guest',
      userEmail: req.user?.email || null,
      reportTitle: report.title,
      reportType: report.reportType,
      reportIndustry: report.industry,
      metadata: {
        userAgent: req.get('User-Agent'),
        ip: req.ip,
        timestamp: new Date().toISOString()
      },
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    MOCK_FEEDBACK.push(feedback);
    res.status(201).json({
      success: true,
      data: {
        feedbackId: feedback.id,
        status: feedback.status,
        message: 'Feedback submitted successfully'
      },
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to submit feedback',
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    });
  }
}

// GET /api/feedback - Get feedback (for reviewers)
function getFeedback(req, res) {
  try {
    if (req.user?.role !== 'reviewer') {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions to view feedback',
        requestId: req.requestId,
        timestamp: new Date().toISOString()
      });
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    let filteredFeedback = [...MOCK_FEEDBACK];
    if (req.query.reportId) {
      filteredFeedback = filteredFeedback.filter(f => f.reportId === req.query.reportId);
    }
    if (req.query.feedbackType) {
      filteredFeedback = filteredFeedback.filter(f => f.feedbackType === req.query.feedbackType);
    }
    if (req.query.status) {
      filteredFeedback = filteredFeedback.filter(f => f.status === req.query.status);
    }
    filteredFeedback.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const totalFeedback = filteredFeedback.length;
    const paginatedFeedback = filteredFeedback.slice(offset, offset + limit);
    res.json({
      success: true,
      data: {
        feedback: paginatedFeedback,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalFeedback / limit),
          totalFeedback,
          hasNext: page < Math.ceil(totalFeedback / limit),
          hasPrev: page > 1
        },
        stats: {
          total: MOCK_FEEDBACK.length,
          pending: MOCK_FEEDBACK.filter(f => f.status === 'pending').length,
          reviewed: MOCK_FEEDBACK.filter(f => f.status === 'reviewed').length,
          resolved: MOCK_FEEDBACK.filter(f => f.status === 'resolved').length
        }
      },
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch feedback',
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    });
  }
}

// PUT /api/feedback/:id/status - Update feedback status (for reviewers)
function updateFeedbackStatus(req, res) {
  try {
    if (req.user?.role !== 'reviewer') {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions to update feedback',
        requestId: req.requestId,
        timestamp: new Date().toISOString()
      });
    }
    const feedbackId = req.params.id;
    const { status, reviewerComment } = req.body;
    const validStatuses = ['pending', 'reviewed', 'resolved', 'dismissed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be one of: ' + validStatuses.join(', '),
        requestId: req.requestId,
        timestamp: new Date().toISOString()
      });
    }
    const feedback = MOCK_FEEDBACK.find(f => f.id === feedbackId);
    if (!feedback) {
      return res.status(404).json({
        success: false,
        error: 'Feedback not found',
        requestId: req.requestId,
        timestamp: new Date().toISOString()
      });
    }
    feedback.status = status;
    feedback.reviewerComment = reviewerComment || null;
    feedback.reviewerId = req.user.userId;
    feedback.reviewedAt = new Date().toISOString();
    res.json({
      success: true,
      data: {
        feedbackId,
        status,
        message: 'Feedback status updated successfully'
      },
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update feedback status',
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = {
  submitFeedback,
  getFeedback,
  updateFeedbackStatus
}; 