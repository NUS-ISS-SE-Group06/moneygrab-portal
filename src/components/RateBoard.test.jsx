// RateBoard.test.jsx
import React from 'react';
import { render, screen, within } from '@testing-library/react';
import RateBoard from './RateBoard';

const sampleRates = [
  {
    currencyCode: 'USD',
    unit: '1',
    tradeType: 'BUY_SELL',
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
    tradeType: 'BUY_SELL',
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

describe('RateBoard Component', () => {
  test('renders Normal Monitor Style correctly', () => {
    render(<RateBoard style="Normal Monitor Style" rates={sampleRates} />);
    const usdRow = screen.getByText('USD').closest('tr');
    const eurRow = screen.getByText('EUR').closest('tr');

    expect(within(usdRow).getByText('1')).toBeInTheDocument(); // unit
    expect(within(usdRow).getByText('1.9999')).toBeInTheDocument(); // rtBid
    expect(within(usdRow).getByText('2.0001')).toBeInTheDocument(); // rtAsk

    expect(within(eurRow).getByText('1')).toBeInTheDocument(); // unit
    expect(within(eurRow).getByText('2.1111')).toBeInTheDocument(); // rtBid
    expect(within(eurRow).getByText('2.2222')).toBeInTheDocument(); // rtAsk
  });

  test('renders Extended Monitor Style with all key figures', () => {
    render(<RateBoard style="Extended Monitor Style" rates={sampleRates} />);
    const usdRow = screen.getByText('USD').closest('tr');
    const eurRow = screen.getByText('EUR').closest('tr');

    // Check USD values
    expect(within(usdRow).getByText('1.2345')).toBeInTheDocument(); // wsBid
    expect(within(usdRow).getByText('1.3456')).toBeInTheDocument(); // wsAsk
    expect(within(usdRow).getByText('1.3333')).toBeInTheDocument(); // dpBid
    expect(within(usdRow).getByText('1.4444')).toBeInTheDocument(); // dpAsk
    expect(within(usdRow).getByText('2.0001')).toBeInTheDocument(); // rtAsk

    // Check EUR values
    expect(within(eurRow).getByText('1.4444')).toBeInTheDocument(); // wsBid
    expect(within(eurRow).getByText('1.5555')).toBeInTheDocument(); // wsAsk
    expect(within(eurRow).getByText('1.3334')).toBeInTheDocument(); // dpBid
    expect(within(eurRow).getByText('1.4445')).toBeInTheDocument(); // dpAsk
    expect(within(eurRow).getByText('2.2222')).toBeInTheDocument(); // rtAsk
  });

test('renders Multi Currency Style layout', () => {
  render(<RateBoard style="Multi Currency Style" rates={sampleRates} />);

  // USD section
  const usdRow = screen.getAllByText('USD')[0].closest('tr');
  expect(within(usdRow).getByText('1.2345')).toBeInTheDocument(); // wsBid
  expect(within(usdRow).getByText('1.3456')).toBeInTheDocument(); // wsAsk

  // EUR section
  const eurRow = screen.getAllByText('EUR')[0].closest('tr');
  expect(within(eurRow).getByText('1.4444')).toBeInTheDocument(); // wsBid
  expect(within(eurRow).getByText('1.5555')).toBeInTheDocument(); // wsAsk
});

  test('falls back to Normal Monitor Style for unknown style', () => {
    render(<RateBoard style="Unknown Style" rates={sampleRates} />);
    expect(screen.getByText('USD')).toBeInTheDocument();
    expect(screen.getByText('EUR')).toBeInTheDocument();
    expect(screen.getByText('2.0001')).toBeInTheDocument();
  });

  test('handles empty rate list', () => {
    render(<RateBoard style="Normal Monitor Style" rates={[]} />);
    expect(screen.queryByText('USD')).not.toBeInTheDocument();
    expect(screen.queryByText('EUR')).not.toBeInTheDocument();
  });
});

