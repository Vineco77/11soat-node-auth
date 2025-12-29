const path = require('path');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  
  // Detectar automaticamente as pastas de teste
  roots: ['<rootDir>'],
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/*.spec.ts',
    '**/*.test.ts',
    '**/test/**/*.ts'
  ],
  
  collectCoverage: true,
  
  // COLETAR COBERTURA DE TODAS AS PASTAS POSSÍVEIS
  collectCoverageFrom: [
    'src/**/*.ts',
    'app/**/*.ts',
    'lib/**/*.ts',
    'core/**/*.ts',
    'domain/**/*.ts',
    'application/**/*.ts',
    'infrastructure/**/*.ts',
    
    // EXCLUSÕES (arquivos que NÃO precisam de cobertura)
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
    '!**/test/**',
    '!**/*.spec.ts',
    '!**/*.test.ts'
  ],
  
  coverageDirectory: 'coverage',
  
  // RELATÓRIOS DETALHADOS
  coverageReporters: [
    'json-summary',  // Para análise programática
    'lcov',          // Para SonarQube
    'text',          // Para console
    'html',          // Para relatório HTML
    'json'           // Para análise detalhada
  ],
  
  // THRESHOLD GLOBAL DE 80%
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  reporters: [
    'default',
    ['jest-sonar', {
      outputDirectory: '.',
      outputName: 'test-report.xml',
      reportedFilePath: 'relative'
    }]
  ],
  
  // DETECTAR ESTRUTURA AUTOMATICAMENTE
  moduleDirectories: ['node_modules', 'src', 'app', 'lib'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  
  // MAPEAMENTO DE CAMINHOS (ajuste conforme necessário)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@app/(.*)$': '<rootDir>/app/$1',
    '^@lib/(.*)$': '<rootDir>/lib/$1'
  }
};