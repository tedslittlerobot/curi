module.exports = {
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "jsx"
  ],
  "testMatch": [
    "**/tests/**/*.spec.tsx"
  ],
  "transform": {
    "\\.tsx?$": "<rootDir>/node_modules/ts-jest/preprocessor.js"
  },
  "globals": {
    "ts-jest": {
      "module": "es6"
    }
  },
  "setupFiles": ["<rootDir>/tests/setup/rAF.js", "<rootDir>/tests/setup/enzyme.js"],
  "mapCoverage": true,
  "collectCoverageFrom": [
    "src/*.tsx"
  ]
};
