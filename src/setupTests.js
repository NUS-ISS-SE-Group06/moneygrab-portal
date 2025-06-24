import "@testing-library/jest-dom";

// Create a mock axios instance
const mockAxios = {
  get: jest.fn(() =>
    Promise.resolve({
      data: [
        { id: 1, code: "USD", name: "US Dollar" },
        { id: 2, code: "EUR", name: "Euro" },
      ],
    })
  ),
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
  const firstArg = args[0];

  const shouldSuppress =
    (typeof firstArg === "string" &&
      (firstArg.includes("Fetch error:") ||
        firstArg.includes("Schemes Error:") ||
        firstArg.includes("Cannot read properties of undefined"))) ||
    (typeof firstArg === "object" &&
      firstArg?.response?.status === 409 &&
      typeof firstArg?.response?.data === "string" &&
      firstArg.response.data.includes("Commission rate for the same currency"));

  if (shouldSuppress) return;

  originalError(...args);
};


