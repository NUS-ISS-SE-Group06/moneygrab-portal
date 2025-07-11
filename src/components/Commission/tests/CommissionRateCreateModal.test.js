import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock all external dependencies first
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn()
}));

// Only mock cache constants if the file actually exists
// If it doesn't exist, you can define the constant in your test or component
const mockCacheDuration = 300000;

// Import after mocking
import api from '../../../api/axios';
import CommissionRateCreateModal from '../CommissionRateCreateModal';

const mockedApi = api;

describe('CommissionRateCreateModal', () => {
  let queryClient;
  
  const mockSelectedScheme = {
    id: 1,
    nameTag: 'Scheme A'
  };

  const mockCurrencyList = [
    { id: 1, currency: 'USD' },
    { id: 2, currency: 'EUR' },
    { id: 3, currency: 'GBP' }
  ];

  const defaultProps = {
    selectedScheme: mockSelectedScheme,
    onClose: jest.fn(),
    onCreated: jest.fn()
  };

  const renderWithQueryClient = (component) => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          staleTime: mockCacheDuration,
        },
      },
    });
    
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock successful currency list fetch
    mockedApi.get.mockResolvedValue({ data: mockCurrencyList });
    mockedApi.post.mockResolvedValue({ 
      data: { 
        id: 123, 
        currencyId: 2, 
        schemeId: 1, 
        rate: 0.8,
        createdBy: 1 
      } 
    });
  });

  afterEach(() => {
    queryClient?.clear();
  });

  it('renders the modal with correct initial state', async () => {
    renderWithQueryClient(<CommissionRateCreateModal {...defaultProps} />);
    
    expect(screen.getByText('Create Commission Rates')).toBeInTheDocument();
    expect(screen.getByText('Scheme A')).toBeInTheDocument();
    expect(screen.getByLabelText(/Symbol/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Commission Rate/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();

    // Wait for currency list to load
    await waitFor(() => {
      expect(screen.getByText('USD')).toBeInTheDocument();
      expect(screen.getByText('EUR')).toBeInTheDocument();
      expect(screen.getByText('GBP')).toBeInTheDocument();
    });

    expect(mockedApi.get).toHaveBeenCalledWith('/api/v1/currencies');
  });

  it('displays scheme nameTag when selectedScheme is null', () => {
    const propsWithNullScheme = {
      ...defaultProps,
      selectedScheme: null
    };
    
    renderWithQueryClient(<CommissionRateCreateModal {...propsWithNullScheme} />);
    
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('closes modal when close button is clicked', () => {
    renderWithQueryClient(<CommissionRateCreateModal {...defaultProps} />);
    
    const closeButton = screen.getByRole('button', { name: 'Close' });
    fireEvent.click(closeButton);
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('shows validation error when no currency is selected', async () => {
    renderWithQueryClient(<CommissionRateCreateModal {...defaultProps} />);
    
    const saveButton = screen.getByRole('button', { name: 'Save' });
    fireEvent.click(saveButton);
    
  await waitFor(() => {
  expect(screen.getByText((content) =>
    content.includes('Symbol is required.')
  )).toBeInTheDocument();
});

    expect(mockedApi.post).not.toHaveBeenCalled();
  });

  it('shows validation error when no commission rate is provided', async () => {
    renderWithQueryClient(<CommissionRateCreateModal {...defaultProps} />);
    
    // Wait for currencies to load
    await waitFor(() => {
      expect(screen.getByText('USD')).toBeInTheDocument();
    });

    const currencySelect = screen.getByLabelText(/Symbol/);
    fireEvent.change(currencySelect, { target: { value: '1' } });
    
    const saveButton = screen.getByRole('button', { name: 'Save' });
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText('A valid commission rate greater than 0 is required.')).toBeInTheDocument();
    });

    expect(mockedApi.post).not.toHaveBeenCalled();
  });

  it('shows validation error when commission rate is invalid', async () => {
    renderWithQueryClient(<CommissionRateCreateModal {...defaultProps} />);
    
    // Wait for currencies to load
    await waitFor(() => {
      expect(screen.getByText('USD')).toBeInTheDocument();
    });

    const currencySelect = screen.getByLabelText(/Symbol/);
    const rateInput = screen.getByLabelText(/Commission Rate/);
    
    fireEvent.change(currencySelect, { target: { value: '1' } });
    fireEvent.change(rateInput, { target: { value: '-0.5' } });
    
    const saveButton = screen.getByRole('button', { name: 'Save' });
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText('A valid commission rate greater than 0 is required.')).toBeInTheDocument();
    });

    expect(mockedApi.post).not.toHaveBeenCalled();
  });

  it('submits valid data successfully', async () => {
    renderWithQueryClient(<CommissionRateCreateModal {...defaultProps} />);
    
    // Wait for currencies to load
    await waitFor(() => {
      expect(screen.getByText('EUR')).toBeInTheDocument();
    });

    const currencySelect = screen.getByLabelText(/Symbol/);
    const rateInput = screen.getByLabelText(/Commission Rate/);
    
    fireEvent.change(currencySelect, { target: { value: '2' } });
    fireEvent.change(rateInput, { target: { value: '0.75' } });
    
    const saveButton = screen.getByRole('button', { name: 'Save' });
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(mockedApi.post).toHaveBeenCalledWith('/api/v1/commission-rates', {
        currencyId: 2,
        schemeId: 1,
        rate: '0.75',
        createdBy: 1
      });
    });

    expect(defaultProps.onCreated).toHaveBeenCalledWith({
      id: 123,
      currencyId: 2,
      schemeId: 1,
      rate: 0.8,
      createdBy: 1,
      currency: 'EUR',
      nameTag: 'Scheme A'
    });
    
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('handles API error on submission', async () => {
    const errorMessage = 'Commission rate already exists';
    mockedApi.post.mockRejectedValue({
      response: { data: errorMessage }
    });

    renderWithQueryClient(<CommissionRateCreateModal {...defaultProps} />);
    
    // Wait for currencies to load
    await waitFor(() => {
      expect(screen.getByText('USD')).toBeInTheDocument();
    });

    const currencySelect = screen.getByLabelText(/Symbol/);
    const rateInput = screen.getByLabelText(/Commission Rate/);
    
    fireEvent.change(currencySelect, { target: { value: '1' } });
    fireEvent.change(rateInput, { target: { value: '0.5' } });
    
    const saveButton = screen.getByRole('button', { name: 'Save' });
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    expect(defaultProps.onCreated).not.toHaveBeenCalled();
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it('displays query error when currency fetch fails', async () => {
    const queryError = new Error('Failed to fetch currencies');
    mockedApi.get.mockRejectedValue(queryError);

    renderWithQueryClient(<CommissionRateCreateModal {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch currencies')).toBeInTheDocument();
    });
  });

  it('has correct input id mismatch (documenting the bug)', () => {
    renderWithQueryClient(<CommissionRateCreateModal {...defaultProps} />);
    
    const label = screen.getByText('Commission Rate');
    const input = screen.getByLabelText(/Commission Rate/);
    
    // The bug: label has "commission-rate-input" but input has "commision-rate-input" (missing 's')
    expect(label.getAttribute('for')).toBe('commission-rate-input');
    expect(input.getAttribute('id')).toBe('commission-rate-input');
    
    // This test documents the accessibility issue - they should match
    expect(label.getAttribute('for')).toBe(input.getAttribute('id'));
  });
});