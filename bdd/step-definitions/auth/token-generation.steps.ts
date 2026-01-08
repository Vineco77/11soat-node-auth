import { loadFeature, defineFeature } from 'jest-cucumber';
import { CreateJwtUseCase } from '../../../src/core/application/use-cases/create-jwt.use-cases';
import { UserFactory } from '../../utils/factories/user.factory';
import { createMockUserRepository, createMockUserRepositoryWithEmployee } from '../../utils/mocks/user-repository.mock';
import { createMockJwtService } from '../../utils/mocks/jwt-service.mock';
import { resolveFeaturePath } from '../../utils/paths';

const feature = loadFeature(resolveFeaturePath('features/auth/token-generation.feature'));

defineFeature(feature, (test) => {
  let useCase: CreateJwtUseCase;
  let mockUserRepository: any;
  let mockJwtService: any;
  let userData: any;
  let result: any;
  let error: any;

  beforeEach(() => {
    mockUserRepository = createMockUserRepository();
    mockJwtService = createMockJwtService();
    
    useCase = new CreateJwtUseCase(
      mockJwtService,
      mockUserRepository
    );

    error = null;
    result = null;
    userData = {};
  });

  test('Generate client token without CPF', ({ given, when, then, and }) => {
    given('I am a user with valid client data', () => {
      userData = UserFactory.createUserWithoutCPF();
    });

    when('I generate a JWT token', async () => {
      try {
        result = await useCase.execute(userData.cpf, userData.name, userData.email);
      } catch (err) {
        error = err;
      }
    });

    then('I should receive a valid token', () => {
      expect(error).toBeNull();
      expect(result).toBeDefined();
      expect(result.token).toBeDefined();
    });

    and('the token should have client type', () => {
      expect(mockJwtService.createToken).toHaveBeenCalledWith(
        expect.objectContaining({
          user_type: 'cliente'
        })
      );
    });
  });

  test('Generate client token with unregistered CPF', ({ given, when, then, and }) => {
    given('I am a user with valid CPF that is not registered as employee', () => {
      userData = UserFactory.createEmployeeData();
      mockUserRepository.findByCpf.mockResolvedValue(null);
    });

    when('I generate a JWT token', async () => {
      try {
        result = await useCase.execute(userData.cpf, userData.name);
      } catch (err) {
        error = err;
      }
    });

    then('I should receive a valid token', () => {
      expect(error).toBeNull();
      expect(result).toBeDefined();
      expect(result.token).toBeDefined();
    });

    and('the token should have client type', () => {
      expect(mockJwtService.createToken).toHaveBeenCalledWith(
        expect.objectContaining({
          user_type: 'cliente'
        })
      );
    });

    and('the token should contain the CPF', () => {
      expect(mockJwtService.createToken).toHaveBeenCalledWith(
        expect.objectContaining({
          cpf: userData.cpf
        })
      );
    });
  });

  test('Generate employee token with registered CPF', ({ given, when, then, and }) => {
    given('I am a user with a CPF that is registered as employee', () => {
      userData = UserFactory.createEmployeeData();
      mockUserRepository = createMockUserRepositoryWithEmployee(userData.cpf);
      useCase = new CreateJwtUseCase(mockJwtService, mockUserRepository);
    });

    when('I generate a JWT token', async () => {
      try {
        result = await useCase.execute(userData.cpf, userData.name);
      } catch (err) {
        error = err;
      }
    });

    then('I should receive a valid token', () => {
      expect(error).toBeNull();
      expect(result).toBeDefined();
      expect(result.token).toBeDefined();
    });

    and('the token should have employee type', () => {
      expect(mockJwtService.createToken).toHaveBeenCalledWith(
        expect.objectContaining({
          user_type: 'funcionario'
        })
      );
    });

    and('the token should contain the CPF', () => {
      expect(mockJwtService.createToken).toHaveBeenCalledWith(
        expect.objectContaining({
          cpf: userData.cpf
        })
      );
    });
  });

  test('Fail to generate token with invalid CPF format', ({ given, when, then, and }) => {
    given('I am a user with invalid CPF format', () => {
      userData = UserFactory.createInvalidCPFData();
    });

    when('I try to generate a JWT token', async () => {
      try {
        result = await useCase.execute(userData.cpf, userData.name);
      } catch (err) {
        error = err;
      }
    });

    then('the token generation should fail', () => {
      expect(error).toBeDefined();
      expect(result).toBeNull();
    });

    and('I should receive a validation error', () => {
      expect(error.message).toMatch(/invalid|CPF|format/i);
    });
  });

  test('Generate token with minimal data', ({ given, when, then, and }) => {
    given('I am a user with no additional data', () => {
      userData = {};
    });

    when('I generate a JWT token', async () => {
      try {
        result = await useCase.execute();
      } catch (err) {
        error = err;
      }
    });

    then('I should receive a valid token', () => {
      expect(error).toBeNull();
      expect(result).toBeDefined();
      expect(result.token).toBeDefined();
    });

    and('the token should have client type', () => {
      expect(mockJwtService.createToken).toHaveBeenCalledWith(
        expect.objectContaining({
          user_type: 'cliente'
        })
      );
    });
  });
});