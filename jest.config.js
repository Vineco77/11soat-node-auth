const path = require('path');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  
  // ⭐ SUAS PASTAS REAIS
  roots: ['<rootDir>/src', '<rootDir>/libs/auth-lib/src'],
  
  testMatch: [
    '<rootDir>/src/**/*.spec.ts',
    '<rootDir>/src/**/*.test.ts',
    '<rootDir>/libs/auth-lib/src/**/*.spec.ts',
    '<rootDir>/libs/auth-lib/src/**/*.test.ts',
    '<rootDir>/libs/auth-lib/test/**/*.spec.ts',
    '<rootDir>/libs/auth-lib/test/**/*.test.ts'
  ],
  
  collectCoverage: true,
  
  // ⭐ COBERTURA APENAS DAS SUAS PASTAS REAIS
  collectCoverageFrom: [
    'src/**/*.ts',
    'libs/auth-lib/src/**/*.ts',
    
    // Exclusões
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
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  reporters: ['default'],
  
  // ⭐ IMPORTANTE: Ignorar pastas que não são código
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/prisma/migrations/',
    '/coverage/'
  ],
  
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/prisma/migrations/',
    '/coverage/',
    '/test/'
  ],
  
  // ⭐ Mapeamento de módulos para seu projeto
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@libs/(.*)$': '<rootDir>/libs/$1'
  }
};