import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ReportViewerSystem from './pages/ReportViewerSystem.jsx';
import { ThemeProvider } from './components/ThemeContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <ReportViewerSystem />
    </ThemeProvider>
  </StrictMode>,
);
