import "@testing-library/jest-dom";

// Create a mock axios instance with better data structure
const mockAxios = {
  get: jest.fn((url) => {
    // Mock different endpoints based on URL
    if (url.includes('compute-rates')) {
      return Promise.resolve({
        data: [
          { 
            currencyCode: "USD", 
            unit: "1", 
            tradeType: "BUY_SELL",
            deno: "ALL",
            rounding: 2,
            rawBid: 1.0000,
            rawAsk: 1.0020,
            spread: 0.0020,
            skew: 0.0000
          },
          { 
            currencyCode: "EUR", 
            unit: "1", 
            tradeType: "BUY_SELL",
            deno: "ALL", 
            rounding: 4,
            rawBid: 0.8500,
            rawAsk: 0.8520,
            spread: 0.0020,
            skew: 0.0000
          }
        ]
      });
    }
    // Default response for other endpoints
    return Promise.resolve({ data: [] });
  }),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
};

// Mock path is correct for setupTests.js in src/ folder
jest.mock("./api/axios", () => mockAxios);

// Suppress console.warn for React Router
const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    typeof args[0] === "string" &&
    args[0].includes("React Router will begin wrapping state updates")
  ) {
    return;
  }
  originalWarn(...args);
};

// Fixed console.error suppression with proper syntax
const originalError = console.error;
console.error = (...args) => {
  const firstArg = args[0];

  const shouldSuppress =
    (typeof firstArg === "string" &&
      (firstArg.includes("Fetch error:") ||
        firstArg.includes("Schemes Error:") ||
        firstArg.includes("Cannot read properties of undefined") ||
        firstArg.includes("Warning: An update to") ||
        firstArg.includes("act(...)") ||
        firstArg.includes("wrapped in act"))) ||
    (typeof firstArg === "object" &&
      firstArg?.response?.data &&
      typeof firstArg.response.data === "string" &&
      (firstArg.response.data.includes("Commission rate for the same currency") ||
       firstArg.response.data.includes("Rate update failed due to conflict") ||
       firstArg.response.data.includes("Failed to update scheme")));

  if (shouldSuppress) return;

  originalError(...args);
};

// Mock window.matchMedia for components that use it
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver if your components use it
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver if your components use it
// global.ResizeObserver = class ResizeObserver {
//   constructor() {}
//   disconnect() {}
//   observe() {}
//   unobserve() {}
// };