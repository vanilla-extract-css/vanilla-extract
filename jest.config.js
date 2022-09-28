module.exports = {
  setupFilesAfterEnv: ['./jest.setup.ts'],
  transform: {
    '\\.css\\.ts$': '@vanilla-extract/jest-transform',
    '\\.tsx?$': ['babel-jest', { configFile: './babel-jest.config.js' }],
  },
  testMatch: ['**/?(*.)+(test).[jt]s?(x)'],
  testTimeout: 10000,
};
