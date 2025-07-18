import React from 'react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export default function ReportFilters({ filters, setFilters, reports }) {
  const reportTypes = [...new Set(reports.map((r) => r.reportType))];
  const industries = [...new Set(reports.map((r) => r.industry))];

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      reportType: '',
      confidenceScore: '',
      industry: '',
    });
  };

  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <div className="border-b border-border bg-card px-6 py-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Filters:</span>

          <Select value={filters.reportType} onValueChange={(value) => updateFilter('reportType', value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Report Type" />
            </SelectTrigger>
            <SelectContent>
              {reportTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.confidenceScore} onValueChange={(value) => updateFilter('confidenceScore', value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Min Confidence" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="90">90%+</SelectItem>
              <SelectItem value="80">80%+</SelectItem>
              <SelectItem value="70">70%+</SelectItem>
              <SelectItem value="60">60%+</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.industry} onValueChange={(value) => updateFilter('industry', value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
} 