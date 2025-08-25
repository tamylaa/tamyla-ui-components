module.exports = {
  preset: 'jest-preset-jsdom',
  testEnvironment: 'jsdom',
  
  roots: ['<rootDir>/src', '<rootDir>/atoms', '<rootDir>/molecules', '<rootDir>/applications'],
  
  testMatch: [
    '**/__tests__/**/*.(js|ts)',
    '**/*.(test|spec).(js|ts)'
  ],
  
  moduleFileExtensions: ['js', 'ts', 'json'],
  
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.ts$': 'ts-jest'
  },
  
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@atoms/(.*)$': '<rootDir>/atoms/$1',
    '^@molecules/(.*)$': '<rootDir>/molecules/$1',
    '^@organisms/(.*)$': '<rootDir>/organisms/$1',
    '^@applications/(.*)$': '<rootDir>/applications/$1',
    '^@core/(.*)$': '<rootDir>/core/$1'
  },
  
  setupFilesAfterEnv: ['<rootDir>/build/jest.setup.js'],
  
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    'atoms/**/*.{js,ts}',
    'molecules/**/*.{js,ts}',
    'applications/**/*.{js,ts}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/*.config.js'
  ],
  
  coverageReporters: ['text', 'lcov', 'html'],
  
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  
  testTimeout: 10000,
  
  verbose: true
};
