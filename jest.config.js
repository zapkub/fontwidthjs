module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
  ],
};