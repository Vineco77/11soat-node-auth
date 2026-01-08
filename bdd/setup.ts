process.env.JWT_SECRET = 'test-jwt-secret';
process.env.ADMIN_SECRET_KEY = 'test-admin-secret-key';

globalThis.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
};

afterAll(() => {
  jest.restoreAllMocks();
});