module.exports = {
  modulePathIgnorePatterns: ["flycheck_.*"],
  testPathIgnorePatterns: ["/spec.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
