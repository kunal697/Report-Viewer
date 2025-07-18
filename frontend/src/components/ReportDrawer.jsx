import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ChevronDown, ExternalLink, Shield, Database, Globe, MessageSquare, Send, AlertTriangle } from 'lucide-react';
import ConfidenceMeter from './ConfidenceMeter';
import Tag from './Tag';

// --- SourceTraceCards Component (JSX version) ---
const SourceTraceCards = ({ sources }) => {
  const [expandedSource, setExpandedSource] = useState(null);
  // Map both lowercase and title-case types to icons
  const getSourceIcon = (type) => {
    if (!type) return ExternalLink;
    const t = type.toLowerCase();
    if (t.includes('database')) return Database;
    if (t.includes('api')) return Globe;
    if (t.includes('secure') || t.includes('verification')) return Shield;
    if (t.includes('market')) return Globe;
    if (t.includes('financial')) return Database;
    if (t.includes('survey')) return Globe;
    return ExternalLink;
  };
  // Accept both reliability and fallback to 100 if missing
  const getReliabilityColor = (score) => {
    if (typeof score !== 'number') score = 100;
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Our confidence is built on {sources?.length || 0} verified sources
      </div>
      {sources?.map((source, index) => {
        const Icon = getSourceIcon(source.type);
        const isExpanded = expandedSource === index;
        const reliability = typeof source.reliability === 'number' ? source.reliability : (source.verified ? 100 : 70);
        // Fallback for name/type
        const displayName = source.name || source.title || source.type || 'Source';
        const displayType = source.type || 'Source';
        // Icon background for dark/light
        const iconBg = `bg-[#3F1470] bg-opacity-10 dark:bg-[#FFA301] dark:bg-opacity-20`;
        return (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${iconBg}`}> {/* Icon background adapts to theme */}
                    <Icon className="h-4 w-4" style={{ color: '#3F1470', filter: 'drop-shadow(0 0 2px #fff)' }} />
                  </div>
                  <div>
                    <CardTitle className="text-base">{displayName}</CardTitle>
                    <p className="text-sm text-muted-foreground">{source.description || displayType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getReliabilityColor(reliability)}`} />
                  <span className="text-sm">{reliability}%</span>
                  <Button variant="ghost" size="sm" onClick={() => setExpandedSource(isExpanded ? null : index)}>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CardContent className="pt-0 border-t border-border">
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <span className="px-2 py-1 rounded bg-[#FFA301] text-xs font-semibold text-[#18122B]">{displayType}</span>
                      <span className="px-2 py-1 rounded border text-xs font-semibold border-[#FFA301] text-[#FFA301]">Last Updated: {source.lastUpdated ? source.lastUpdated : 'N/A'}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Data Points</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {(source.dataPoints || source.details ? [source.details] : []).concat(source.dataPoints || []).filter(Boolean).map((point, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <div className="w-1 h-1 rounded-full bg-[#FFA301] mt-2 flex-shrink-0" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-muted-foreground">Verification: {source.verification ? source.verification : (source.verified ? (source.verified === true ? 'Verified' : 'Pending') : 'Unknown')}</span>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View Source
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </motion.div>
            )}
          </Card>
        );
      })}
    </div>
  );
};

// --- FeedbackForm Component (JSX version) ---
const FeedbackForm = ({ reportId }) => {
  const [feedback, setFeedback] = useState({ type: '', comment: '', flaggedSection: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Dummy toast for now
  const toast = ({ title, description }) => alert(`${title}\n${description}`);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast({ title: 'Feedback submitted', description: "Thank you for your input. We'll review it shortly." });
      setFeedback({ type: '', comment: '', flaggedSection: '' });
      setIsSubmitting(false);
    }, 1000);
  };
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Improve This Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Feedback Type</label>
              <div className="relative">
                <select
                  className="w-full border rounded px-3 py-2 bg-white dark:bg-[#18122B] text-black dark:text-white appearance-none"
                  value={feedback.type}
                  onChange={e => setFeedback(prev => ({ ...prev, type: e.target.value }))}
                >
                  <option value="">Select feedback type</option>
                  <option value="suggestion">Suggestion</option>
                  <option value="error">Report Error</option>
                  <option value="missing">Missing Information</option>
                  <option value="accuracy">Accuracy Concern</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-muted-foreground" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Flagged Section (Optional)</label>
              <div className="relative">
                <select
                  className="w-full border rounded px-3 py-2 bg-white dark:bg-[#18122B] text-black dark:text-white appearance-none"
                  value={feedback.flaggedSection}
                  onChange={e => setFeedback(prev => ({ ...prev, flaggedSection: e.target.value }))}
                >
                  <option value="">Select section</option>
                  <option value="summary">Executive Summary</option>
                  <option value="insights">Key Insights</option>
                  <option value="confidence">Confidence Score</option>
                  <option value="sources">Source Data</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-muted-foreground" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Comments</label>
              <textarea
                className="w-full border rounded px-3 py-2 bg-white dark:bg-[#18122B] text-black dark:text-white"
                value={feedback.comment}
                onChange={e => setFeedback(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Describe your feedback..."
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 rounded bg-[#3F1470] text-white hover:bg-[#FFA301] hover:text-[#3F1470] transition-colors font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        </CardContent>
      </Card>
      <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
            <AlertTriangle className="h-5 w-5" />
            Report Critical Issues
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
            Found a critical error that could impact decision-making? Flag it immediately for priority review.
          </p>
          <Button
            variant="outline"
            className="border-yellow-300 text-yellow-800 hover:bg-yellow-100 dark:border-yellow-700 dark:text-yellow-200 bg-transparent"
          >
            Flag Critical Issue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

// Icon mapping for report types
const reportTypeIconMap = {
  financial: { icon: Database, bg: '#3F1470', color: '#fff' },
  technical: { icon: Shield, bg: '#FFA301', color: '#18122B' },
  market: { icon: Globe, bg: '#3F1470', color: '#fff' },
  operational: { icon: Shield, bg: '#FFA301', color: '#18122B' },
  survey: { icon: Globe, bg: '#3F1470', color: '#fff' },
  default: { icon: ExternalLink, bg: '#e5e7eb', color: '#374151' },
};

const ReportDrawer = ({ report, open, onClose }) => {
  const [activeTab, setActiveTab] = useState('summary');
  if (!open || !report) return null;
  // Pick icon for report type
  const { icon: ReportIcon, bg: reportIconBg, color: reportIconColor } = reportTypeIconMap[report.reportType] || reportTypeIconMap.default;
  // Date logic
  const dateString = report.updatedAt || report.lastUpdated || report.createdAt;
  const date = dateString ? new Date(dateString) : null;
  const formattedDate = date && !isNaN(date.getTime()) ? date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed top-0 right-0 h-full w-full sm:w-[620px] bg-background shadow-2xl z-50 border-l border-border flex flex-col"
      aria-modal="true"
      role="dialog"
    >
      <div className="border-b border-border p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-xl font-bold mb-2">{report.title}</h2>
            <p className="text-sm text-muted-foreground">{report.industry} • {report.reportType}</p>
            <div className="text-xs font-semibold mt-1 text-[#3F1470] dark:text-[#FFA301]">Last Updated: {formattedDate}</div>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-auto p-6">
        <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 mb-4 bg-muted rounded-lg">
            <TabsTrigger value="summary" className={activeTab === 'summary' ? 'font-bold bg-[#3F1470] text-black dark:bg-[#FFA301] dark:text-[#3F1470] border-b-4 border-[#FFA301] dark:border-[#3F1470]' : 'text-foreground dark:text-muted-foreground'}>Summary</TabsTrigger>
            <TabsTrigger value="trust" className={activeTab === 'trust' ? 'font-bold bg-[#3F1470] text-black dark:bg-[#FFA301] dark:text-[#3F1470] border-b-4 border-[#FFA301] dark:border-[#3F1470]' : 'text-foreground dark:text-muted-foreground'}>Why We Trust This</TabsTrigger>
            <TabsTrigger value="feedback" className={activeTab === 'feedback' ? 'font-bold bg-[#3F1470] text-black dark:bg-[#FFA301] dark:text-[#3F1470] border-b-4 border-[#FFA301] dark:border-[#3F1470]' : 'text-foreground dark:text-muted-foreground'}>Feedback</TabsTrigger>
          </TabsList>
          <TabsContent value="summary" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Confidence Score
                  <span className="text-sm font-normal text-muted-foreground">({report.confidenceScore}%)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ConfidenceMeter score={report.confidenceScore} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Executive Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed mb-2">{report.summary}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {report.tags && report.tags.map((tag, i) => (
                    <Tag key={i} color="gold" text={tag} />
                  ))}
                </div>
              </CardContent>
            </Card>
            {report.keyInsights && (
              <Card>
                <CardHeader>
                  <CardTitle>Key Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {report.keyInsights.map((insight, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FFA301] mt-2 flex-shrink-0" />
                        {insight}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="trust">
            <SourceTraceCards sources={report.sources} />
          </TabsContent>
          <TabsContent value="feedback">
            <FeedbackForm reportId={report.id} />
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default ReportDrawer; 