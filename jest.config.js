module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(axios|react|react-dom|react-router|react-router-dom)/)",
  ],
  moduleFileExtensions: ["js", "jsx"],
  setupFilesAfterEnv: ["./src/setupTests.js"]
};