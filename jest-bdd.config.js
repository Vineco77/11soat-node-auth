module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  
  roots: ['<rootDir>/bdd'],
  
  testMatch: [
    '<rootDir>/bdd/step-definitions/**/*.steps.ts'
  ],
  
  setupFilesAfterEnv: ['<rootDir>/bdd/setup.ts'],
  
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: 'tsconfig.json'
    }]
  },
  
  collectCoverage: false,
  
  testPathIgnorePatterns: ['/node_modules/', '/dist/']
};