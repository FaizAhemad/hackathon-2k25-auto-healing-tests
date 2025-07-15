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
  status: 'PASSED' | 'HEALED' | 'FAILED';
  originalSelector: string;
  healedSelector?: string;
  error?: string;
}

export default function Dashboard() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for initial development
    const mockData: TestResult[] = [
      {
        name: "Test 1",
        status: "PASSED" as const,
        originalSelector: "#loginBtn",
        healedSelector: "#loginBtn"
      },
      {
        name: "Test 2",
        status: "HEALED" as const,
        originalSelector: "#oldBtn",
        healedSelector: ".new-btn"
      },
      {
        name: "Test 3",
        status: "FAILED" as const,
        originalSelector: "#missingBtn",
        error: "Element not found"
      }
    ];
    setResults(mockData);
    setLoading(false);
  }, []);

  const chartData = {
    labels: ['Passed', 'Healed', 'Failed'],
    datasets: [
      {
        label: 'Test Results',
        data: [
          results.filter(r => r.status === 'PASSED').length,
          results.filter(r => r.status === 'HEALED').length,
          results.filter(r => r.status === 'FAILED').length,
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Element Healing Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Tests</Typography>
              <Typography variant="h3">{results.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Success Rate</Typography>
              <Typography variant="h3">
                {Math.round((results.filter(r => r.status !== 'FAILED').length / results.length) * 100)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Healed Elements</Typography>
              <Typography variant="h3">
                {results.filter(r => r.status === 'HEALED').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Test Results Distribution
              </Typography>
              <Bar data={chartData} />
            </CardContent>
          </Card>
        </Grid>

        {/* Results Table */}
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Test Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Original Selector</TableCell>
                  <TableCell>Healed Selector</TableCell>
                  <TableCell>Error</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map((result, index) => (
                  <TableRow key={index}>
                    <TableCell>{result.name}</TableCell>
                    <TableCell>{result.status}</TableCell>
                    <TableCell>{result.originalSelector}</TableCell>
                    <TableCell>{result.healedSelector || 'N/A'}</TableCell>
                    <TableCell>{result.error || 'None'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  );
}
