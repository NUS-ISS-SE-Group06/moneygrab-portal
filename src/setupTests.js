import "@testing-library/jest-dom";

// Create a mock axios instance
const mockAxios = {
  get: jest.fn(() => Promise.resolve({ data: [] })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
};

// Redirect all imports from `../api/axios` to the mock
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

// Suppress console.error for API fetch errors
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === "string" &&
    (args[0].includes("Fetch error:") || 
     args[0].includes("Schemes Error:") ||
     args[0].includes("Cannot read properties of undefined"))
  ) {
    return;
  }
  originalError(...args);
};