import { AppError, ErrorParams } from './app.error';
import { HttpException, HttpStatus } from './http.exception';

describe('AppError', () => {
  describe('constructor', () => {
    it('should create an AppError with default values', () => {
      const params: ErrorParams = {
        message: 'Test error',
      };

      const error = new AppError(params);

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(HttpException);
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(error.errorType).toBe('ApplicationError');
      expect(error.details).toBeUndefined();
    });

    it('should create an AppError with custom statusCode', () => {
      const params: ErrorParams = {
        message: 'Custom error',
        statusCode: HttpStatus.BAD_REQUEST,
      };

      const error = new AppError(params);

      expect(error.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(error.message).toBe('Custom error');
    });

    it('should create an AppError with custom errorType', () => {
      const params: ErrorParams = {
        message: 'Type error',
        errorType: 'CustomError',
      };

      const error = new AppError(params);

      expect(error.errorType).toBe('CustomError');
      expect(error.response.error).toBe('CustomError');
    });

    it('should create an AppError with details', () => {
      const details = { field: 'value', nested: { key: 'data' } };
      const params: ErrorParams = {
        message: 'Detailed error',
        details,
      };

      const error = new AppError(params);

      expect(error.details).toEqual(details);
      expect(error.response.details).toEqual(details);
    });

    it('should create an AppError with all custom parameters', () => {
      const params: ErrorParams = {
        message: 'Complete error',
        statusCode: HttpStatus.FORBIDDEN,
        errorType: 'CompleteError',
        details: { info: 'test' },
      };

      const error = new AppError(params);

      expect(error.message).toBe('Complete error');
      expect(error.statusCode).toBe(HttpStatus.FORBIDDEN);
      expect(error.errorType).toBe('CompleteError');
      expect(error.details).toEqual({ info: 'test' });
    });
  });

  describe('notFound', () => {
    it('should create a not found error', () => {
      const error = AppError.notFound({ message: 'Resource not found' });

      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Resource not found');
      expect(error.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(error.errorType).toBe('NotFoundError');
      expect(error.response.error).toBe('NotFoundError');
    });

    it('should create a not found error with details', () => {
      const details = { resourceId: '123', resourceType: 'User' };
      const error = AppError.notFound({
        message: 'User not found',
        details,
      });

      expect(error.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(error.details).toEqual(details);
    });
  });

  describe('badRequest', () => {
    it('should create a bad request error', () => {
      const error = AppError.badRequest({ message: 'Invalid input' });

      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Invalid input');
      expect(error.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(error.errorType).toBe('BadRequestError');
      expect(error.response.error).toBe('BadRequestError');
    });

    it('should create a bad request error with details', () => {
      const details = { field: 'email', reason: 'Invalid format' };
      const error = AppError.badRequest({
        message: 'Validation failed',
        details,
      });

      expect(error.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(error.details).toEqual(details);
    });
  });

  describe('unauthorized', () => {
    it('should create an unauthorized error', () => {
      const error = AppError.unauthorized({ message: 'Not authenticated' });

      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Not authenticated');
      expect(error.statusCode).toBe(HttpStatus.UNAUTHORIZED);
      expect(error.errorType).toBe('UnauthorizedError');
      expect(error.response.error).toBe('UnauthorizedError');
    });

    it('should create an unauthorized error with details', () => {
      const details = { token: 'expired', expiresAt: '2024-01-01' };
      const error = AppError.unauthorized({
        message: 'Token expired',
        details,
      });

      expect(error.statusCode).toBe(HttpStatus.UNAUTHORIZED);
      expect(error.details).toEqual(details);
    });
  });

  describe('forbidden', () => {
    it('should create a forbidden error', () => {
      const error = AppError.forbidden({ message: 'Access denied' });

      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Access denied');
      expect(error.statusCode).toBe(HttpStatus.FORBIDDEN);
      expect(error.errorType).toBe('ForbiddenError');
      expect(error.response.error).toBe('ForbiddenError');
    });

    it('should create a forbidden error with details', () => {
      const details = { requiredRole: 'admin', currentRole: 'user' };
      const error = AppError.forbidden({
        message: 'Insufficient permissions',
        details,
      });

      expect(error.statusCode).toBe(HttpStatus.FORBIDDEN);
      expect(error.details).toEqual(details);
    });
  });

  describe('conflict', () => {
    it('should create a conflict error', () => {
      const error = AppError.conflict({ message: 'Resource already exists' });

      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Resource already exists');
      expect(error.statusCode).toBe(HttpStatus.CONFLICT);
      expect(error.errorType).toBe('ConflictError');
      expect(error.response.error).toBe('ConflictError');
    });

    it('should create a conflict error with details', () => {
      const details = { field: 'email', value: 'test@example.com' };
      const error = AppError.conflict({
        message: 'Email already in use',
        details,
      });

      expect(error.statusCode).toBe(HttpStatus.CONFLICT);
      expect(error.details).toEqual(details);
    });
  });

  describe('internal', () => {
    it('should create an internal server error', () => {
      const error = AppError.internal({ message: 'Something went wrong' });

      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Something went wrong');
      expect(error.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(error.errorType).toBe('InternalServerError');
      expect(error.response.error).toBe('InternalServerError');
    });

    it('should create an internal server error with details', () => {
      const details = { stack: 'error stack', originalError: 'Database error' };
      const error = AppError.internal({
        message: 'Database connection failed',
        details,
      });

      expect(error.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(error.details).toEqual(details);
    });
  });

  describe('response object', () => {
    it('should have correct response structure for all static methods', () => {
      const errors = [
        AppError.notFound({ message: 'Not found' }),
        AppError.badRequest({ message: 'Bad request' }),
        AppError.unauthorized({ message: 'Unauthorized' }),
        AppError.forbidden({ message: 'Forbidden' }),
        AppError.conflict({ message: 'Conflict' }),
        AppError.internal({ message: 'Internal' }),
      ];

      errors.forEach((error) => {
        expect(error.response).toHaveProperty('message');
        expect(error.response).toHaveProperty('statusCode');
        expect(error.response).toHaveProperty('error');
        expect(error.response.message).toBe(error.message);
        expect(error.response.statusCode).toBe(error.statusCode);
        expect(error.response.error).toBe(error.errorType);
      });
    });

    it('should include details in response when provided', () => {
      const details = { test: 'data' };
      const error = AppError.badRequest({
        message: 'Test',
        details,
      });

      expect(error.response.details).toEqual(details);
    });

    it('should not include details in response when not provided', () => {
      const error = AppError.badRequest({ message: 'Test' });

      expect(error.response.details).toBeUndefined();
    });
  });

  describe('inheritance', () => {
    it('should be catchable as Error', () => {
      const error = AppError.badRequest({ message: 'Test' });

      expect(error instanceof Error).toBe(true);
    });

    it('should be catchable as HttpException', () => {
      const error = AppError.badRequest({ message: 'Test' });

      expect(error instanceof HttpException).toBe(true);
    });

    it('should have Error properties', () => {
      const error = AppError.badRequest({ message: 'Test error' });

      expect(error.message).toBeDefined();
      expect(error.stack).toBeDefined();
      expect(error.name).toBe('Error');
    });
  });
});
