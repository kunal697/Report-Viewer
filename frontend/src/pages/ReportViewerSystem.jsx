import '../../src/App.css';
import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import ReportFilters from '../components/ReportFilters';
import ReportCard from '../components/ReportCard';
import ReportDrawer from '../components/ReportDrawer';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../components/ThemeContext';

const ReportViewerSystem = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filters, setFilters] = useState({ reportType: '', confidenceScore: '', industry: '' });
  const { theme } = useTheme();

  useEffect(() => {
    fetch('http://localhost:5000/api/reports')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.reports) {
          setReports(data.data.reports);
          setFilteredReports(data.data.reports);
        }
      })
      .catch(err => console.error('Failed to fetch reports:', err));
  }, []);

  useEffect(() => {
    let filtered = reports.filter(report => {
      const matchesTitle = report.title.toLowerCase().includes((filters.searchTerm || '').toLowerCase());
      const matchesType = !filters.reportType || report.reportType === filters.reportType;
      const matchesIndustry = !filters.industry || report.industry === filters.industry;
      const matchesConfidence = !filters.confidenceScore || report.confidenceScore >= parseInt(filters.confidenceScore);
      return matchesTitle && matchesType && matchesIndustry && matchesConfidence;
    });
    setFilteredReports(filtered);
  }, [filters, reports]);

  return (
    <div className={theme === 'dark' ? 'dark min-h-screen transition-colors duration-300' : 'min-h-screen transition-colors duration-300'}>
      <div className="bg-background text-foreground min-h-screen">
        {/* Header */}
        <div className="bg-background shadow-sm border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold">Report Viewer</h1>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-card rounded-xl shadow-sm border border-border p-6 mb-8 text-card-foreground">
            <ReportFilters
              filters={filters}
              setFilters={setFilters}
              reports={reports}
            />
          </div>
          <h2 className="text-xl font-bold mb-4">Reports</h2>
          <div className="grid grid-cols-1 gap-6 mt-4">
            {filteredReports.map((report, idx) => (
              <ReportCard key={report.id} report={report} onClick={() => setSelectedReport(report)} index={idx} />
            ))}
          </div>
          {filteredReports.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-lg">No reports found matching your criteria.</div>
          )}
        </div>
        <ReportDrawer
          report={selectedReport}
          open={!!selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      </div>
    </div>
  );
};

export default ReportViewerSystem; 