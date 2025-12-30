const path = require('path');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  
  // ⭐ CORREÇÃO: Focar apenas no diretório src
  roots: ['<rootDir>/src'],
  
  // ⭐ CORREÇÃO: Padrões mais específicos
  testMatch: [
    '<rootDir>/src/**/*.spec.ts',
    '<rootDir>/src/**/*.test.ts',
    '<rootDir>/src/__tests__/**/*.ts'
  ],
  
  collectCoverage: true,
  
  // ⭐ CORREÇÃO: Coletar apenas de src, não de todas as pastas
  collectCoverageFrom: [
    'src/**/*.ts',
    // ⭐ REMOVA estas linhas se não existem essas pastas:
    // 'app/**/*.ts',
    // 'lib/**/*.ts',
    // 'core/**/*.ts',
    // 'domain/**/*.ts',
    // 'application/**/*.ts',
    // 'infrastructure/**/*.ts',
    
    // EXCLUSÕES
    '!**/*.dto.ts',
    '!**/*.enum.ts',
    '!**/value-objects/**',
    '!**/*.interface.ts',
    '!**/main.ts',
    '!**/index.ts',
    '!**/*.module.ts',
    '!**/app.module.ts',
    '!**/*.config.ts',
    '!**/migrations/**',
    '!**/seeders/**',
    '!**/node_modules/**',
    '!**/*.spec.ts',
    '!**/*.test.ts',
    '!**/__tests__/**/*.ts'
  ],
  
  coverageDirectory: 'coverage',
  
  // ⭐ CORREÇÃO: Mantenha apenas o essencial
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
  
  // ⭐ CORREÇÃO: Simplifique
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  
  // ⭐ CORREÇÃO: Verifique se precisa destes mapeamentos
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1'
  },
  
  // ⭐ ADICIONE: Para melhor performance
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/']
};