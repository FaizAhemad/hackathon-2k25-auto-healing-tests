import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TestResult {
  name: string;
  status: 'PASSED' | 'HEALED' | 'FAILED';  // Removed NO_CHANGE
  originalSelector: string;
  healedSelector?: string;
  error?: string;
  explanation?: string;
  jira_url?: string;
}

export default function Dashboard() {
  const [results, setResults] = useState<TestResult[]>([]);  // Start with empty array
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        setError(null);
        // Call the Python API to run the test cases
        const response = await fetch('http://localhost:8000/api/test-healing', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const formattedResults: TestResult[] = data.map((result: any) => ({
          name: result.name,
          status: result.status === 'NO_CHANGE' ? 'PASSED' : result.status, // Convert NO_CHANGE to PASSED
          originalSelector: result.original_selector,
          healedSelector: result.healed_selector,
          error: result.error,
          explanation: result.explanation
        }));
        
        setResults(formattedResults);
      } catch (error) {
        console.error('Error fetching test results:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch test results');
      } finally {
        setLoading(false);
      }
    };

    fetchTestResults();
    
    // Set up polling every 30 seconds to get fresh results
    const intervalId = setInterval(fetchTestResults, 30000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const totalTests = results.length;
  const healedCount = results.filter(r => r.status === 'HEALED').length;
  const passedCount = results.filter(r => r.status === 'PASSED').length;
  const failedCount = results.filter(r => r.status === 'FAILED').length;
  const successRate = ((passedCount + healedCount) / totalTests) * 100;

  const chartData = {
    labels: ['Passed', 'Healed', 'Failed'],
    datasets: [
      {
        label: 'Test Results',
        data: [
          passedCount,
          healedCount,
          failedCount
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',  // Green for passed
          'rgba(54, 162, 235, 0.6)',   // Blue for healed
          'rgba(255, 99, 132, 0.6)',   // Red for failed
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>  {/* Changed to xl for more space */}
      {error && (
        <Box sx={{ mb: 2 }}>
          <Alert severity="error">
            {error}
          </Alert>
        </Box>
      )}
      <Grid container spacing={3}>
        {/* Stats Cards Row */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            {/* Total Tests Card */}
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', minHeight: 160 }}>
                <CardContent sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  textAlign: 'center'
                }}>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Total Tests
                  </Typography>
                  <Typography variant="h2" component="div" sx={{ mb: 2 }}>
                    {loading ? <CircularProgress size={40} /> : results.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Success Rate Card */}
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', minHeight: 160 }}>
                <CardContent sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  textAlign: 'center'
                }}>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Success Rate
                  </Typography>
                  <Typography variant="h2" component="div" sx={{ mb: 1 }}>
                    {loading ? (
                      <CircularProgress size={40} />
                    ) : (
                      `${Math.round(successRate)}%`
                    )}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Passed: {passedCount}, Healed: {healedCount}, Failed: {failedCount}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Healed Elements Card */}
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', minHeight: 160 }}>
                <CardContent sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  textAlign: 'center'
                }}>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Healed Elements
                  </Typography>
                  <Typography variant="h2" component="div" sx={{ mb: 2 }}>
                    {loading ? <CircularProgress size={40} /> : healedCount}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Chart */}
        <Grid item xs={12}>
          <Card sx={{ p: 2, height: '100%', minHeight: 400 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom align="center">
                Test Results Distribution
              </Typography>
              <Box sx={{ height: 300, pt: 2 }}>
                <Bar 
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      }
                    }
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Results Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
                Test Results Details
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Test Name</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Original Selector</TableCell>
                      <TableCell>Healed Selector</TableCell>
                      <TableCell>Explanation</TableCell>
                      <TableCell>Error</TableCell>
                      <TableCell>JIRA</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {results.map((result, index) => (
                      <TableRow 
                        key={index}
                        sx={{
                          backgroundColor: 
                            result.status === 'FAILED' ? '#ffebee' :  // Light red
                            result.status === 'HEALED' ? '#e3f2fd' :  // Light blue
                            result.status === 'PASSED' ? '#e8f5e9' :  // Light green
                            'inherit',
                          '&:hover': {
                            backgroundColor: 
                              result.status === 'FAILED' ? '#ffcdd2' :  // Slightly darker red
                              result.status === 'HEALED' ? '#bbdefb' :  // Slightly darker blue
                              result.status === 'PASSED' ? '#c8e6c9' :  // Slightly darker green
                              'inherit'
                          }
                        }}
                      >
                        <TableCell>{result.name}</TableCell>
                        <TableCell>
                          <Typography
                            sx={{
                              color: 
                                result.status === 'FAILED' ? '#d32f2f' :  // Red text
                                result.status === 'HEALED' ? '#1976d2' :  // Blue text
                                result.status === 'PASSED' ? '#388e3c' :  // Green text
                                'inherit'
                            }}
                          >
                            {result.status}
                          </Typography>
                        </TableCell>
                        <TableCell>{result.originalSelector}</TableCell>
                        <TableCell>{result.healedSelector || 'N/A'}</TableCell>
                        <TableCell>{result.explanation || 'N/A'}</TableCell>
                        <TableCell>{result.error || 'None'}</TableCell>
                        <TableCell>
                          {result.jira_url ? (
                            <a href={result.jira_url} target="_blank" rel="noopener noreferrer">
                              View Issue
                            </a>
                          ) : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
