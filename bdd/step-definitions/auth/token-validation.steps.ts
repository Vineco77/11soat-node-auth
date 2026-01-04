import { loadFeature, defineFeature } from 'jest-cucumber';
import { ValidateJwtUseCase } from '../../../src/core/application/use-cases/validate-jwt.use-case';
import { createMockJwtService } from '../../utils/mocks/jwt-service.mock';
import { resolveFeaturePath } from '../../utils/paths';

const feature = loadFeature(resolveFeaturePath('features/auth/token-validation.feature'));

defineFeature(feature, (test) => {
  let useCase: ValidateJwtUseCase;
  let mockJwtService: any;
  let token: string;
  let result: any;
  let error: any;

  beforeEach(() => {
    mockJwtService = createMockJwtService();
    useCase = new ValidateJwtUseCase(mockJwtService);
    
    error = null;
    result = null;
  });

  test('Validate valid token', ({ given, when, then, and }) => {
    given('I have a valid JWT token', () => {
      token = 'valid_token';
      mockJwtService.validateToken.mockResolvedValue({
        sub: 'test_subject',
        cpf: 'test_cpf',
        user_type: 'cliente'
      });
    });

    when('I validate the token', async () => {
      try {
        result = await useCase.execute(token);
      } catch (err) {
        error = err;
      }
    });

    then('the validation should succeed', () => {
      expect(error).toBeNull();
      expect(result).toBeDefined();
    });

    and('I should receive the token payload', () => {
      expect(result.sub).toBeDefined();
      expect(result.cpf).toBeDefined();
      expect(result.user_type).toBeDefined();
    });
  });

  test('Validate expired token', ({ given, when, then, and }) => {
    given('I have an expired JWT token', () => {
      token = 'expired_token';
      mockJwtService.validateToken.mockRejectedValue(
        new Error('Token expired')
      );
    });

    when('I validate the token', async () => {
      try {
        result = await useCase.execute(token);
      } catch (err) {
        error = err;
      }
    });

    then('the validation should fail', () => {
      expect(error).toBeDefined();
      expect(result).toBeNull();
    });

    and('I should receive an expired token error', () => {
      expect(error.message).toMatch(/expired|invalid|unauthorized/i);
    });
  });

  test('Validate invalid token', ({ given, when, then, and }) => {
    given('I have an invalid JWT token', () => {
      token = 'invalid_token';
      mockJwtService.validateToken.mockRejectedValue(
        new Error('Invalid token')
      );
    });

    when('I validate the token', async () => {
      try {
        result = await useCase.execute(token);
      } catch (err) {
        error = err;
      }
    });

    then('the validation should fail', () => {
      expect(error).toBeDefined();
      expect(result).toBeNull();
    });

    and('I should receive an invalid token error', () => {
      expect(error.message).toMatch(/invalid|unauthorized/i);
    });
  });

  test('Validate malformed token', ({ given, when, then }) => {
    given('I have a malformed token string', () => {
      token = 'not_a_jwt_token';
      mockJwtService.validateToken.mockRejectedValue(
        new Error('Token validation failed')
      );
    });

    when('I validate the token', async () => {
      try {
        result = await useCase.execute(token);
      } catch (err) {
        error = err;
      }
    });

    then('the validation should fail', () => {
      expect(error).toBeDefined();
      expect(result).toBeNull();
    });
  });
});