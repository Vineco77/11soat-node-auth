const path = require('path');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  
  roots: ['<rootDir>/src', '<rootDir>/libs/auth-lib/src'],
  
  testMatch: [
    '<rootDir>/src/**/*.spec.ts',
    '<rootDir>/src/**/*.test.ts',
    '<rootDir>/libs/auth-lib/src/**/*.spec.ts',
    '<rootDir>/libs/auth-lib/src/**/*.test.ts'
  ],
  
  maxWorkers: '50%',
  
  collectCoverageFrom: [
    'src/**/*.ts',
    'libs/auth-lib/src/**/*.ts',
    
    // Exclusões - arquivos que NÃO exigem 80%
    '!**/*.dto.ts',
    '!**/*.enum.ts',
    '!**/value-objects/**',
    '!**/*.interface.ts',
    '!**/main.ts',
    '!**/index.ts',
    '!**/*.module.ts',
    '!**/app.module.ts',
    '!**/*.config.ts',
    '!prisma/migrations/**',
    '!**/node_modules/**',
    '!**/*.spec.ts',
    '!**/*.test.ts',
    '!**/test/**'
  ],
  
  coverageDirectory: 'coverage',
  coverageReporters: ['json-summary', 'lcov', 'text'],
  
  coverageThreshold: {
    './src/**/*.ts': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    './libs/auth-lib/src/**/*.ts': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  reporters: ['default'],
  
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],
  
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@libs/(.*)$': '<rootDir>/libs/$1'
  }
};