import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp, Shield, FileText } from 'lucide-react';

const getConfidenceColor = (score) => {
  if (score >= 90) return 'bg-green-500';
  if (score >= 80) return 'bg-yellow-500';
  return 'bg-red-500';
};

const getReportIcon = (type) => {
  switch (type) {
    case 'market':
      return TrendingUp;
    case 'technical':
      return Shield;
    default:
      return FileText; // Use FileText for general reports
  }
};

const formatDate = (report) => {
  const dateString = report.updatedAt || report.lastUpdated || report.createdAt;
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const ReportCard = ({ report, onClick, index = 0 }) => {
  const Icon = getReportIcon(report.reportType);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card
        className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-[#3F1470]/50 dark:hover:border-[#FFA301]/50"
        onClick={onClick}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#3F1470] bg-opacity-10 dark:bg-[#FFA301] dark:bg-opacity-10">
                <Icon className="h-6 w-6" style={{ color: '#3F1470', filter: 'drop-shadow(0 0 2px #fff)' }} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{report.title}</h3>
                <p className="text-sm text-muted-foreground">{report.industry}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getConfidenceColor(report.confidenceScore)}`} />
              <span className="text-sm font-medium">{report.confidenceScore}%</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{report.summary}</p>
          <div className="flex items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary">{report.reportType}</Badge>
              {report.tags && report.tags.map((tag, i) => (
                <Badge key={i} variant="outline">{tag}</Badge>
              ))}
            </div>
            <span className="text-xs font-semibold text-[#3F1470] dark:text-[#FFA301]">
              {formatDate(report)}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ReportCard; 