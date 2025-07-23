import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, AppBar, Toolbar, Typography } from '@mui/material';
import URLShortenerPage from './URLShortenerPage';
import URLStatisticsPage from './URLStatisticsPage';
import { Log } from './loggingMiddleware.js';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  React.useEffect(() => {
    // Log app initialization
    Log('frontend', 'info', 'controller', 'React URL Shortener App initialized');
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              URL Shortener
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={<URLShortenerPage />} />
            <Route path="/stats/:shortcode" element={<URLStatisticsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
