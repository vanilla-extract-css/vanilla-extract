module.exports = {
  setupFilesAfterEnv: ['./jest.setup.ts'],
  transform: {
    '\\.tsx?$': ['babel-jest', { configFile: './babel-jest.config.js' }],
  },
  testMatch: ['**/?(*.)+(test).[jt]s?(x)'],
  testTimeout: 10000,
  resolver: '<rootDir>/jest-resolver.js',
};
