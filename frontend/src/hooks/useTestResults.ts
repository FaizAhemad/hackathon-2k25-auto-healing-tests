import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export interface TestResult {
  name: string;
  status: 'PASSED' | 'HEALED' | 'FAILED' | 'NO_CHANGE';
  originalSelector: string;
  healedSelector?: string;
  explanation?: string;
  error?: string;
  info?: string;
  jira_url?: string;
}

export const useTestResults = () => {
  return useQuery(['testResults'], async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/test-results`);
      return response.data as TestResult[];
    } catch (error) {
      console.error('Error fetching test results:', error);
      throw error;
    }
  });
};
