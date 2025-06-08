module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/**/?(*.)+(spec|test).js'],
  testPathIgnorePatterns: ['<rootDir>/tests/browser/'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
};
