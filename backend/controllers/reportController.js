const MOCK_REPORTS = require('../data/mockdata.json');

// Helper: get unique values for a field
function getUniqueValues(field) {
  const values = [...new Set(MOCK_REPORTS.map(report => report[field]))];
  return values.filter(value => value);
}

// Helper: filter reports
function getReportsByFilter(filters) {
  let filteredReports = [...MOCK_REPORTS];
  if (filters.reportType && filters.reportType !== 'all') {
    filteredReports = filteredReports.filter(report => report.reportType === filters.reportType);
  }
  if (filters.industry && filters.industry !== 'all') {
    filteredReports = filteredReports.filter(report => report.industry === filters.industry);
  }
  if (filters.confidenceScore) {
    filteredReports = filteredReports.filter(report => report.confidenceScore >= filters.confidenceScore);
  }
  if (filters.status && filters.status !== 'all') {
    filteredReports = filteredReports.filter(report => report.status === filters.status);
  }
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredReports = filteredReports.filter(report =>
      report.title.toLowerCase().includes(searchTerm) ||
      report.summary.toLowerCase().includes(searchTerm) ||
      (report.tags && report.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
    );
  }
  return filteredReports;
}

// GET /api/reports
function getAllReports(req, res) {
  try {
    const filters = {
      reportType: req.query.reportType,
      industry: req.query.industry,
      confidenceScore: req.query.confidenceScore ? parseInt(req.query.confidenceScore) : null,
      status: req.query.status,
      search: req.query.search
    };
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const filteredReports = getReportsByFilter(filters);
    const totalReports = filteredReports.length;
    const paginatedReports = filteredReports.slice(offset, offset + limit);
    const reportsWithUserData = paginatedReports.map(report => ({
      ...report,
      canEdit: req.user?.role === 'reviewer',
      viewerRole: req.user?.role || 'guest'
    }));
    res.json({
      success: true,
      data: {
        reports: reportsWithUserData,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalReports / limit),
          totalReports,
          hasNext: page < Math.ceil(totalReports / limit),
          hasPrev: page > 1
        },
        filters: {
          applied: filters,
          available: {
            reportTypes: getUniqueValues('reportType'),
            industries: getUniqueValues('industry'),
            statuses: getUniqueValues('status')
          }
        }
      },
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reports',
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    });
  }
}

// GET /api/reports/:id
function getReportById(req, res) {
  try {
    const report = MOCK_REPORTS.find(report => report.id === req.params.id);
    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found',
        requestId: req.requestId,
        timestamp: new Date().toISOString()
      });
    }
    const reportWithUserData = {
      ...report,
      canEdit: req.user?.role === 'reviewer',
      viewerRole: req.user?.role || 'guest'
    };
    res.json({
      success: true,
      data: reportWithUserData,
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch report',
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    });
  }
}

// GET /api/reports/stats/overview
function getReportStats(req, res) {
  try {
    const allReports = getReportsByFilter({});
    const stats = {
      total: allReports.length,
      byStatus: {
        verified: allReports.filter(r => r.status === 'verified').length,
        under_review: allReports.filter(r => r.status === 'under_review').length,
        draft: allReports.filter(r => r.status === 'draft').length
      },
      byIndustry: {},
      byReportType: {},
      averageConfidence: 0,
      recentActivity: allReports
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 5)
        .map(report => ({
          id: report.id,
          title: report.title,
          action: 'updated',
          timestamp: report.updatedAt
        }))
    };
    allReports.forEach(report => {
      stats.byIndustry[report.industry] = (stats.byIndustry[report.industry] || 0) + 1;
    });
    allReports.forEach(report => {
      stats.byReportType[report.reportType] = (stats.byReportType[report.reportType] || 0) + 1;
    });
    const totalConfidence = allReports.reduce((sum, report) => sum + report.confidenceScore, 0);
    stats.averageConfidence = Math.round(totalConfidence / allReports.length);
    res.json({
      success: true,
      data: stats,
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics',
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = {
  getAllReports,
  getReportById,
  getReportStats
}; 