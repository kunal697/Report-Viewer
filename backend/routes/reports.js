const express = require('express');
const { getAllReports, getReportById, getReportStats } = require('../controllers/reportController');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/reports - Get all reports with optional filtering
router.get('/', optionalAuth, getAllReports);

// GET /api/reports/stats/overview - Get reports statistics
router.get('/stats/overview', optionalAuth, getReportStats);
router.get('/:id', optionalAuth, getReportById);


module.exports = router;