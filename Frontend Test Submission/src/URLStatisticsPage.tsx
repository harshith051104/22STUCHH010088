import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Card, 
  CardContent, 
  List, 
  ListItem, 
  ListItemText, 
  Button,
  Box,
  Grid,
  Chip
} from '@mui/material';
import { ArrowBack, Timeline } from '@mui/icons-material';
import { Log } from './loggingMiddleware';

interface ClickDetail {
  timestamp: string;
  source: string;
  location: string;
}

interface URLStats {
  shortcode: string | undefined;
  originalUrl: string;
  createdAt: string;
  expiry: string;
  totalClicks: number;
  clickDetails: ClickDetail[];
}

const URLStatisticsPage: React.FC = () => {
  const { shortcode } = useParams<{ shortcode: string }>();
  const navigate = useNavigate();
  const [stats, setStats] = useState<URLStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        await Log('frontend', 'info', 'controller', `Viewing statistics for shortcode: ${shortcode}`);
        
        // Simulate fetching statistics data
        // In a real app, this would be an API call
        const mockStats = {
          shortcode: shortcode,
          originalUrl: 'https://example.com/very-long-url-that-was-shortened',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString(), // 1 day ago
          expiry: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000).toLocaleString(), // 29 days from now
          totalClicks: Math.floor(Math.random() * 100),
          clickDetails: [
            {
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString(),
              source: 'Direct',
              location: 'New York, USA'
            },
            {
              timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toLocaleString(),
              source: 'Social Media',
              location: 'London, UK'
            },
            {
              timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toLocaleString(),
              source: 'Email',
              location: 'Tokyo, Japan'
            }
          ]
        };

        setStats(mockStats);
        await Log('frontend', 'info', 'controller', 'Statistics data loaded successfully');
      } catch (error: unknown) {
        await Log('frontend', 'error', 'controller', `Failed to load statistics: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    if (shortcode) {
      fetchStats();
    }
  }, [shortcode]);

  const handleBackClick = (): void => {
    navigate('/');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography>Loading statistics...</Typography>
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box>
        <Button startIcon={<ArrowBack />} onClick={handleBackClick} sx={{ mb: 2 }}>
          Back to Shortener
        </Button>
        <Typography variant="h6">Statistics not found for shortcode: {shortcode}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Button startIcon={<ArrowBack />} onClick={handleBackClick} sx={{ mb: 2 }}>
        Back to Shortener
      </Button>

      <Typography variant="h4" component="h1" gutterBottom>
        <Timeline sx={{ mr: 1 }} />
        URL Statistics
      </Typography>

      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                URL Information
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Short Code"
                    secondary={<Chip label={stats.shortcode} variant="outlined" />}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Original URL"
                    secondary={stats.originalUrl}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Created At"
                    secondary={stats.createdAt}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Expires At"
                    secondary={stats.expiry}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Click Statistics */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Click Statistics
              </Typography>
              <Box display="flex" alignItems="center" mb={2}>
                <Typography variant="h3" color="primary">
                  {stats.totalClicks}
                </Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>
                  Total Clicks
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                This shortened URL has been accessed {stats.totalClicks} times since creation.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Detailed Click Information */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Click Details
              </Typography>
              {stats.clickDetails.length > 0 ? (
                <List>
                  {stats.clickDetails.map((click: ClickDetail, index: number) => (
                    <ListItem key={index} divider={index < stats.clickDetails.length - 1}>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="body1">
                              Click #{stats.clickDetails.length - index}
                            </Typography>
                            <Chip label={click.source} size="small" />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Time: {click.timestamp}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Location: {click.location}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary">
                  No click data available yet.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default URLStatisticsPage;
