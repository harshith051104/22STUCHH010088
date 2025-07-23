import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Alert,
  Card,
  CardContent,
  Grid,
  IconButton,
  Chip
} from '@mui/material';
import { ContentCopy, BarChart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Log } from './loggingMiddleware';

interface ShortenedURL {
  originalUrl: string;
  shortCode: string;
  expiry: string;
  shortUrl: string;
}

const URLShortenerPage: React.FC = () => {
  const [urls, setUrls] = useState<ShortenedURL[]>([]);
  const [formData, setFormData] = useState({
    originalUrl: '',
    validity: '30',
    shortcode: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>('');
  const navigate = useNavigate();

  // Validation helpers
  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateShortcode = (code: string): boolean => /^[a-zA-Z0-9]{3,10}$/.test(code);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
    setSuccess('');
  };

  const generateRandomShortcode = (): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const copyToClipboard = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccess('Short URL copied to clipboard!');
      await Log('frontend', 'info', 'controller', 'User copied short URL to clipboard');
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  const handleSubmit = async (): Promise<void> => {
    setError('');
    setSuccess('');
    
    // Client-side validation
    if (!validateUrl(formData.originalUrl)) {
      setError('Please enter a valid URL (e.g., https://example.com)');
      await Log('frontend', 'warn', 'controller', 'User submitted invalid URL format');
      return;
    }

    if (formData.validity && (!/^\d+$/.test(formData.validity) || Number(formData.validity) <= 0)) {
      setError('Validity must be a positive number (in minutes)');
      await Log('frontend', 'warn', 'controller', 'User submitted invalid validity period');
      return;
    }

    if (formData.shortcode && !validateShortcode(formData.shortcode)) {
      setError('Shortcode must be 3-10 alphanumeric characters');
      await Log('frontend', 'warn', 'controller', 'User submitted invalid shortcode');
      return;
    }

    if (urls.length >= 5) {
      setError('You can only create up to 5 shortened URLs in this demo');
      await Log('frontend', 'warn', 'controller', 'User exceeded URL limit');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call since we don't have a backend
      const shortcode = formData.shortcode || generateRandomShortcode();
      const expiryTime = new Date(Date.now() + (Number(formData.validity) * 60 * 1000));
      const shortUrl = `http://localhost:3000/${shortcode}`;

      const newUrl = {
        originalUrl: formData.originalUrl,
        shortCode: shortcode,
        expiry: expiryTime.toLocaleString(),
        shortUrl: shortUrl
      };

      setUrls((prev: ShortenedURL[]) => [...prev, newUrl]);
      await Log('frontend', 'info', 'controller', `URL shortened: ${formData.originalUrl} -> ${shortcode}`);
      
      setSuccess(`URL shortened successfully! Short URL: ${shortUrl}`);
      setFormData({ originalUrl: '', validity: '30', shortcode: '' });

    } catch (err: unknown) {
      setError('Failed to shorten URL. Please try again.');
      await Log('frontend', 'error', 'controller', `URL shortening failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const viewStats = (shortcode: string): void => {
    navigate(`/stats/${shortcode}`);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        URL Shortener
      </Typography>
      
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Create Short URL
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Original URL"
                name="originalUrl"
                value={formData.originalUrl}
                onChange={handleChange}
                placeholder="https://example.com/very-long-url"
                required
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Validity (minutes)"
                name="validity"
                type="number"
                value={formData.validity}
                onChange={handleChange}
                helperText="Default: 30 minutes"
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Custom Shortcode (optional)"
                name="shortcode"
                value={formData.shortcode}
                onChange={handleChange}
                placeholder="mycode123"
                helperText="3-10 alphanumeric characters"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading || !formData.originalUrl}
                fullWidth
                size="large"
              >
                {loading ? 'Shortening...' : 'Shorten URL'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {urls.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Your Shortened URLs ({urls.length}/5)
            </Typography>
            
            <List>
              {urls.map((url: ShortenedURL, index: number) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={
                      <Box>
                        <Typography variant="body1" component="div">
                          <strong>Short URL:</strong> 
                          <Chip 
                            label={url.shortUrl} 
                            variant="outlined" 
                            sx={{ ml: 1 }}
                          />
                          <IconButton 
                            size="small" 
                            onClick={() => copyToClipboard(url.shortUrl)}
                            sx={{ ml: 1 }}
                          >
                            <ContentCopy fontSize="small" />
                          </IconButton>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Original: {url.originalUrl}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Expires: {url.expiry}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Button
                        startIcon={<BarChart />}
                        onClick={() => viewStats(url.shortCode)}
                        size="small"
                        sx={{ mt: 1 }}
                      >
                        View Statistics
                      </Button>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default URLShortenerPage;
