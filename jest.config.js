const pathIgnorePatterns = [
  '<rootDir>/__mocks__',
  '<rootDir>/.circleci',
  '<rootDir>/.github',
  '<rootDir>/.jest',
  '<rootDir>/.cache',
  '<rootDir>/coverage',
  '<rootDir>/node_modules',
  '<rootDir>/lib',
];

module.exports = {
  rootDir: './',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*\\.([tj]sx?)|(\\.|/)(test|spec))\\.([tj]sx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: pathIgnorePatterns,
  automock: false,
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!**/*.d.ts', '!**/node_modules/**'],
  coveragePathIgnorePatterns: pathIgnorePatterns,
};
