import { useState, useEffect } from 'react'
// import mockReports from './mockReports.json' // Removed
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import ReportDetailDrawer from './ReportDetailDrawer'
import './App.css'
import { ThemeProvider } from './components/ThemeContext'
import ThemeToggle from './components/ThemeToggle'

function App() {
  const [reports, setReports] = useState([])
  const [filters, setFilters] = useState({ reportType: 'all', confidenceScore: [0, 100], industry: 'all' })
  const [selectedReport, setSelectedReport] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    fetch('http://localhost:5000/api/reports')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.reports) {
          setReports(data.data.reports)
        }
      })
      .catch(err => console.error('Failed to fetch reports:', err))
  }, [])

  const filteredReports = reports.filter(r =>
    (filters.reportType === 'all' || r.reportType === filters.reportType) &&
    (filters.industry === 'all' || r.industry === filters.industry) &&
    r.confidenceScore >= filters.confidenceScore[0] &&
    r.confidenceScore <= filters.confidenceScore[1]
  )

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground p-8 transition-colors duration-300">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#3F1470' }}>Report Viewer</h1>
          <ThemeToggle />
        </header>
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Select value={filters.reportType} onValueChange={v => setFilters(f => ({ ...f, reportType: v }))}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Report Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="financial">Financial</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.industry} onValueChange={v => setFilters(f => ({ ...f, industry: v }))}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2 w-64">
            <span>Confidence</span>
            <Slider
              min={0}
              max={100}
              step={1}
              value={filters.confidenceScore}
              onValueChange={v => setFilters(f => ({ ...f, confidenceScore: v }))}
              className="w-32"
            />
            <span>{filters.confidenceScore[0]}–{filters.confidenceScore[1]}%</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map(report => (
            <Card key={report.id} className="cursor-pointer hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 border-2 border-[#3F1470] dark:border-[#FFA301] bg-white dark:bg-[#1a102b]" onClick={() => { setSelectedReport(report); setDrawerOpen(true) }}>
              <CardHeader>
                <CardTitle className="text-lg font-semibold group-hover:text-[#3F1470] dark:group-hover:text-[#FFA301] transition-colors">{report.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-2">{report.reportType} | {report.industry}</div>
                <div className="font-semibold">Confidence: <span className="text-[#3F1470] dark:text-[#FFA301]">{report.confidenceScore}%</span></div>
                <div className="mt-2 line-clamp-2">{report.summary}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        <ReportDetailDrawer open={drawerOpen} onOpenChange={setDrawerOpen} report={selectedReport} />
      </div>
    </ThemeProvider>
  )
}

export default App
