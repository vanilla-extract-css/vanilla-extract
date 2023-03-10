module.exports = {
  setupFilesAfterEnv: ['./jest.setup.ts'],
  transform: {
    '\\.css\\.ts$': '@vanilla-extract/jest-transform',
    '\\.tsx?$': ['babel-jest', { configFile: './babel-jest.config.js' }],
  },
  testMatch: ['**/?(*.)+(test).[jt]s?(x)', '!**/*.vitest.test*'],
  testTimeout: 10000,
};
