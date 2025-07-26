// PreviewModal.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PreviewModal from '../../modals/PreviewModal';

const mockOnClose = jest.fn();

const sampleRates = [
  {
    currencyCode: 'USD',
    unit: '1',
    wsBid: 1.2345,
    wsAsk: 1.3456,
    refBid: 1.1111,
    refAsk: 1.2222,
    dpBid: 1.3333,
    dpAsk: 1.4444,
    marBid: 1.5555,
    marAsk: 1.6666,
    cfBid: 1.7777,
    cfAsk: 1.8888,
    rtBid: 1.9999,
    rtAsk: 2.0001,
  },
  {
    currencyCode: 'EUR',
    unit: '1',
    wsBid: 1.4444,
    wsAsk: 1.5555,
    refBid: 1.1112,
    refAsk: 1.2223,
    dpBid: 1.3334,
    dpAsk: 1.4445,
    marBid: 1.5556,
    marAsk: 1.6667,
    cfBid: 1.7778,
    cfAsk: 1.8889,
    rtBid: 2.1111,
    rtAsk: 2.2222,
  }
];

describe('PreviewModal', () => {
  test('renders Normal Monitor Style correctly', () => {
    render(<PreviewModal style="Normal Monitor Style" computedRates={sampleRates} onClose={mockOnClose} />);
    expect(screen.getByText('Preview Rates - Normal Monitor Style')).toBeInTheDocument();
    expect(screen.getByText('USD')).toBeInTheDocument();
    expect(screen.getByText('EUR')).toBeInTheDocument();
    expect(screen.getByText('1.9999')).toBeInTheDocument(); // USD rtBid
    expect(screen.getByText('2.2222')).toBeInTheDocument(); // EUR rtAsk
  });

  test('renders Extended Monitor Style correctly', () => {
    render(<PreviewModal style="Extended Monitor Style" computedRates={sampleRates} onClose={mockOnClose} />);
    expect(screen.getByText('Preview Rates - Extended Monitor Style')).toBeInTheDocument();
    expect(screen.getByText('USD')).toBeInTheDocument();
    expect(screen.getByText('EUR')).toBeInTheDocument();
    expect(screen.getByText('1.3456')).toBeInTheDocument(); // USD wsAsk
    expect(screen.getByText('1.4445')).toBeInTheDocument(); // EUR dpAsk
  });

  test('renders Multi Currency Style correctly', () => {
    render(<PreviewModal style="Multi Currency Style" computedRates={sampleRates} onClose={mockOnClose} />);
    expect(screen.getByText('Preview Rates - Multi Currency Style')).toBeInTheDocument();
    expect(screen.getByText('USD')).toBeInTheDocument();
    expect(screen.getByText('EUR')).toBeInTheDocument();
    expect(screen.getByText('1.2345')).toBeInTheDocument(); // USD wsBid
    expect(screen.getByText('1.5555')).toBeInTheDocument(); // EUR wsAsk
  });

  test('does not render modal when isOpen is false (simulated by empty render)', () => {
    const { container } = render(<></>);
    expect(container).toBeEmptyDOMElement();
  });

  test('calls onClose when close button is clicked', () => {
    render(<PreviewModal style="Normal Monitor Style" computedRates={sampleRates} onClose={mockOnClose} />);
    const closeButton = screen.getByRole('button', { name: '×' });
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('drag events do not crash', () => {
    render(<PreviewModal style="Normal Monitor Style" computedRates={sampleRates} onClose={mockOnClose} />);
    const header = screen.getByText('Preview Rates - Normal Monitor Style').closest('div');
    fireEvent.mouseDown(header, { clientX: 100, clientY: 100 });
    fireEvent.mouseMove(document, { clientX: 150, clientY: 150 });
    fireEvent.mouseUp(document);
  });

  test('fallback gracefully with unknown style', () => {
    render(<PreviewModal style="Unknown Style" computedRates={sampleRates} onClose={mockOnClose} />);
    expect(screen.getByText('Preview Rates - Unknown Style')).toBeInTheDocument();
    expect(screen.getByText('USD')).toBeInTheDocument(); // fallback to Normal
    expect(screen.getByText('2.0001')).toBeInTheDocument();
  });
});
