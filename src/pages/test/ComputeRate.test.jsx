// ComputeRate.test.jsx - Jest compatible version
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import PropTypes from 'prop-types';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ComputeRate from '../ComputeRate';

// Test wrapper
const TestWrapper = ({ children }) => (
  <QueryClientProvider client={new QueryClient({ 
    defaultOptions: { 
      queries: { 
        retry: false,
        cacheTime: 0,
        staleTime: 0
      } 
    } 
  })}>
    {children}
  </QueryClientProvider>
);// NOSONAR
TestWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};
describe('ComputeRate Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Clear any existing DOM
    document.body.innerHTML = '';
  });

  test('Component renders with title', () => {
    render(<ComputeRate />, { wrapper: TestWrapper });
    const title = screen.getByText('COMPUTE RATE');
    expect(title).toBeInTheDocument();
  });

  test('Shows loading state initially', () => {
    render(<ComputeRate />, { wrapper: TestWrapper });
    // Use getAllByText since there are multiple loading elements
    const loadingElements = screen.getAllByText('Loading...');
    expect(loadingElements.length).toBeGreaterThan(0);
    expect(loadingElements[0]).toBeInTheDocument();
  });

  test('Does not show error after data loads', async () => {
    render(<ComputeRate />, { wrapper: TestWrapper });
    
    await waitFor(() => {
      // Check that error is not present
      expect(screen.queryByText(/Cannot read properties of undefined/)).not.toBeInTheDocument();
    }, { timeout: 5000 });
  });

  test('Style dropdown works', async () => {
    render(<ComputeRate />, { wrapper: TestWrapper });
    
    await waitFor(() => {
      const styleSelect = screen.getByDisplayValue('Normal Monitor Style');
      expect(styleSelect).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});