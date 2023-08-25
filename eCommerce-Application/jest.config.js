module.exports = {
  coverageDirectory: "coverage",
  moduleNameMapper: {'^.+\\.(scss|css)$': '<rootDir>/config/CSSStub.js'},
  preset: "ts-jest",
  rootDir: './tests',
  testEnvironment: "jest-environment-node",
  testMatch: [
     "**/tests/**/*-test.[jt]s?(x)",
     "**/?(*.)+(spec|test).[tj]s?(x)"
  ],
};
