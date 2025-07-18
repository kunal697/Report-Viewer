const { v4: uuidv4 } = require('uuid');

// Request logging middleware with UUID trace header
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  const requestId = uuidv4();
  
  // Add requestId to request object
  req.requestId = requestId;
  
  // Set trace header
  res.setHeader('X-Trace-ID', requestId);
  
  // Log request start
  console.log(` [${new Date().toISOString()}] ${req.method} ${req.path} - TraceID: ${requestId}`);
  
  // Override res.end to capture response time
  const originalEnd = res.end;
  res.end = function(...args) {
    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms - TraceID: ${requestId}`);
    originalEnd.apply(this, args);
  };
  
  next();
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  const requestId = req.requestId || 'unknown';
  
  console.error(`[${new Date().toISOString()}] Error in ${req.method} ${req.path} - TraceID: ${requestId}`);
  console.error(err.stack);
  
  // Don't expose internal errors in production
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;
  
  res.status(err.status || 500).json({
    error: message,
    requestId,
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  requestLogger,
  errorHandler
};