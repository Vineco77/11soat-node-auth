import { HttpException, HttpStatus, HttpExceptionResponse } from './http.exception';

describe('HttpException', () => {
  describe('HttpStatus', () => {
    it('should have correct status codes', () => {
      expect(HttpStatus.SUCCESS).toBe(200);
      expect(HttpStatus.CREATED).toBe(201);
      expect(HttpStatus.ACCEPTED).toBe(202);
      expect(HttpStatus.NO_CONTENT).toBe(204);
      expect(HttpStatus.NOT_MODIFIED).toBe(304);
      expect(HttpStatus.BAD_REQUEST).toBe(400);
      expect(HttpStatus.UNAUTHORIZED).toBe(401);
      expect(HttpStatus.PAYMENT_REQUIRED).toBe(402);
      expect(HttpStatus.FORBIDDEN).toBe(403);
      expect(HttpStatus.NOT_FOUND).toBe(404);
      expect(HttpStatus.METHOD_NOT_ALLOWED).toBe(405);
      expect(HttpStatus.CONFLICT).toBe(409);
      expect(HttpStatus.INTERNAL_SERVER_ERROR).toBe(500);
      expect(HttpStatus.BAD_GATEWAY).toBe(502);
      expect(HttpStatus.SERVICE_UNAVAILABLE).toBe(503);
      expect(HttpStatus.GATEWAY_TIMEOUT).toBe(504);
      expect(HttpStatus.HTTP_VERSION_NOT_SUPPORTED).toBe(505);
    });
  });

  describe('constructor', () => {
    it('should create exception with string message', () => {
      const message = 'Test error message';
      const statusCode = HttpStatus.BAD_REQUEST;
      
      const exception = new HttpException(message, statusCode);

      expect(exception).toBeInstanceOf(Error);
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.message).toBe(message);
      expect(exception.statusCode).toBe(statusCode);
      expect(exception.response).toEqual({
        statusCode,
        message,
      });
    });

    it('should create exception with HttpExceptionResponse object', () => {
      const response: HttpExceptionResponse = {
        message: 'Detailed error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'InternalError',
        details: { field: 'value' },
      };

      const exception = new HttpException(response, response.statusCode);

      expect(exception).toBeInstanceOf(Error);
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.message).toBe(response.message);
      expect(exception.statusCode).toBe(response.statusCode);
      expect(exception.response).toEqual(response);
    });

    it('should create exception with minimal HttpExceptionResponse', () => {
      const response: HttpExceptionResponse = {
        message: 'Minimal error',
        statusCode: HttpStatus.NOT_FOUND,
      };

      const exception = new HttpException(response, response.statusCode);

      expect(exception.message).toBe(response.message);
      expect(exception.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(exception.response).toEqual(response);
    });

    it('should capture stack trace', () => {
      const exception = new HttpException('Error', HttpStatus.BAD_REQUEST);
      
      expect(exception.stack).toBeDefined();
      expect(typeof exception.stack).toBe('string');
      if (exception.stack) {
        expect(exception.stack.length).toBeGreaterThan(0);
      }
    });

    it('should handle different status codes', () => {
      const statusCodes = [
        HttpStatus.SUCCESS,
        HttpStatus.CREATED,
        HttpStatus.ACCEPTED,
        HttpStatus.NO_CONTENT,
        HttpStatus.NOT_MODIFIED,
        HttpStatus.BAD_REQUEST,
        HttpStatus.UNAUTHORIZED,
        HttpStatus.PAYMENT_REQUIRED,
        HttpStatus.FORBIDDEN,
        HttpStatus.NOT_FOUND,
        HttpStatus.METHOD_NOT_ALLOWED,
        HttpStatus.CONFLICT,
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpStatus.BAD_GATEWAY,
        HttpStatus.SERVICE_UNAVAILABLE,
        HttpStatus.GATEWAY_TIMEOUT,
        HttpStatus.HTTP_VERSION_NOT_SUPPORTED,
      ];

      statusCodes.forEach((statusCode) => {
        const exception = new HttpException('Test', statusCode);
        expect(exception.statusCode).toBe(statusCode);
      });
    });

    it('should handle HttpExceptionResponse with error field', () => {
      const response: HttpExceptionResponse = {
        message: 'Error message',
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'ValidationError',
      };

      const exception = new HttpException(response, response.statusCode);

      expect(exception.response.error).toBe('ValidationError');
    });

    it('should handle HttpExceptionResponse with details field', () => {
      const details = {
        field1: 'error1',
        field2: 'error2',
        nested: {
          field3: 'error3',
        },
      };

      const response: HttpExceptionResponse = {
        message: 'Validation failed',
        statusCode: HttpStatus.BAD_REQUEST,
        details,
      };

      const exception = new HttpException(response, response.statusCode);

      expect(exception.response.details).toEqual(details);
    });

    it('should handle HttpExceptionResponse with all fields', () => {
      const response: HttpExceptionResponse = {
        message: 'Complete error',
        statusCode: HttpStatus.FORBIDDEN,
        error: 'ForbiddenError',
        details: { reason: 'Insufficient permissions' },
      };

      const exception = new HttpException(response, response.statusCode);

      expect(exception.response).toEqual(response);
      expect(exception.message).toBe(response.message);
      expect(exception.statusCode).toBe(response.statusCode);
    });

    it('should handle empty string message', () => {
      const exception = new HttpException('', HttpStatus.BAD_REQUEST);

      expect(exception.message).toBe('');
      expect(exception.response.message).toBe('');
    });

    it('should handle very long messages', () => {
      const longMessage = 'a'.repeat(1000);
      const exception = new HttpException(longMessage, HttpStatus.BAD_REQUEST);

      expect(exception.message).toBe(longMessage);
      expect(exception.response.message).toBe(longMessage);
    });
  });
});
