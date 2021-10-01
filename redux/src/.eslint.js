/* eslint-env node */
module.exports = {
  settings: {
    "import/resolver": {
      alias: {
        map: [["@", "./src"]],
        extensions: [".js", ".json"],
      },
    },
  },
  extends: [
    "eslint:recommended",
    "plugin:jest/recommended",
    "plugin:import/recommended",
  ],
  env: {
    browser: true,
  },
  parser: "@babel/eslint-parser",
};
