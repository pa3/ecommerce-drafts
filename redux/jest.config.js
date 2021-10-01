module.exports = {
  modulePathIgnorePatterns: ["flycheck_.*"],
  testPathIgnorePatterns: ["/spec.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};
