// loggingMiddleware.js
// Your tested and working logging middleware

export async function Log(stack, level, packageName, message) {
  // Validate parameters to match API constraints
  const validStacks = ['backend', 'frontend'];
  const validLevels = ['debug', 'info', 'warn', 'error', 'fatal'];
  const validPackages = ['cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service'];

  // Add your access token here (replace with your actual token from Postman)
  const ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN_HERE'; // Replace with your actual token

  if (!validStacks.includes(stack)) {
    console.warn(`Invalid stack: ${stack}. Using 'frontend' as default.`);
    stack = 'frontend';
  }

  if (!validLevels.includes(level)) {
    console.warn(`Invalid level: ${level}. Using 'info' as default.`);
    level = 'info';
  }

  if (!validPackages.includes(packageName)) {
    console.warn(`Invalid package: ${packageName}. Using 'controller' as default.`);
    packageName = 'controller';
  }

  const logData = {
    stack,
    level,
    package: packageName,
    message,
    timestamp: new Date().toISOString(),
    userAgent: navigator?.userAgent || 'Unknown',
    url: window?.location?.href || 'Unknown'
  };

  // Console logging for development
  const logPrefix = `[${logData.timestamp}] [${level.toUpperCase()}] [${packageName}]`;
  console.log(logPrefix, message);

  try {
    const response = await fetch('http://20.244.56.144/evaluation-service/logs', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': 'LoggingMiddleware/1.0.0',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJndW5uZXNyaWhhcnNoaXRoMjJAaWZoZWluZGlhLm9yZyIsImV4cCI6MTc1MzI1NDc1NCwiaWF0IjoxNzUzMjUzODU0LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiMDk5ZWZjOWUtNTIwYS00ZTE2LTlkZWEtMDA3NWMyZjdjMmViIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiZ3VubmUgc3JpIGhhcnNoaXRoIiwic3ViIjoiNDg5NWQ3M2ItMzI3Yi00ZDFmLWE1ZmEtMDFmZGE0ZGM1MTBjIn0sImVtYWlsIjoiZ3VubmVzcmloYXJzaGl0aDIyQGlmaGVpbmRpYS5vcmciLCJuYW1lIjoiZ3VubmUgc3JpIGhhcnNoaXRoIiwicm9sbE5vIjoiMjJzdHVjaGgwMTAwODgiLCJhY2Nlc3NDb2RlIjoiYkN1Q0ZUIiwiY2xpZW50SUQiOiI0ODk1ZDczYi0zMjdiLTRkMWYtYTVmYS0wMWZkYTRkYzUxMGMiLCJjbGllbnRTZWNyZXQiOiJQeFZXWFdHRHdiTnhnUXBHIn0.BH6N1NjmjtEWQg2vQnm540xO1t6ULXZBT8byJ1Sm8SQ` // Add authorization header
      },
      body: JSON.stringify(logData),
    });

    if (response.ok) {
      console.log('✅ Log successfully sent to test server');
      return true;
    } else {
      console.error('❌ Failed to send log to test server:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Error sending log to test server:', error);
    return false;
  }
}
