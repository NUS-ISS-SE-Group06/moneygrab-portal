module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest", // Transpile JS/TS/JSX/TSX
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(axios|react|react-dom|react-router|react-router-dom)/)",
  ],
  moduleFileExtensions: ["js", "jsx"],
  setupFilesAfterEnv: ["./src/setupTests.js"]
};
