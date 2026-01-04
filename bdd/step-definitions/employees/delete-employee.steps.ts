import { loadFeature, defineFeature } from 'jest-cucumber';
import { DeleteEmployeeUseCase } from '../../../src/core/application/use-cases/delete-employee.use-case';
import { UserFactory } from '../../utils/factories/user.factory';
import { createMockUserRepository, createMockUserRepositoryWithEmployee } from '../../utils/mocks/user-repository.mock';
import { resolveFeaturePath } from '../../utils/paths';

const feature = loadFeature(resolveFeaturePath('features/employees/delete-employee.feature'));

defineFeature(feature, (test) => {
  let useCase: DeleteEmployeeUseCase;
  let mockUserRepository: any;
  let cpf: string;
  let secretKey: string;
  let result: any;
  let error: any;

  beforeEach(() => {
    mockUserRepository = createMockUserRepository();
    useCase = new DeleteEmployeeUseCase(mockUserRepository);
    
    secretKey = process.env.ADMIN_SECRET_KEY!;
    cpf = UserFactory.generateCPF();
    
    error = null;
    result = null;
  });

  test('Successfully delete employee', ({ given, when, then, and }) => {
    given('I am an administrator with valid secret key', () => {
    });

    and('an employee exists with the provided CPF', () => {
      mockUserRepository = createMockUserRepositoryWithEmployee(cpf);
      useCase = new DeleteEmployeeUseCase(mockUserRepository);
    });

    when('I delete the employee', async () => {
      try {
        await useCase.execute(cpf, secretKey);
        result = { success: true };
      } catch (err) {
        error = err;
      }
    });

    then('the employee should be deleted successfully', () => {
      expect(error).toBeNull();
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    and('I should receive a success message', () => {
      expect(mockUserRepository.deleteByCpf).toHaveBeenCalledWith(cpf);
    });
  });

  test('Fail to delete non-existent employee', ({ given, when, then, and }) => {
    given('I am an administrator with valid secret key', () => {
    });

    and('no employee exists with the provided CPF', () => {
      mockUserRepository.findByCpf.mockResolvedValue(null);
    });

    when('I try to delete the employee', async () => {
      try {
        await useCase.execute(cpf, secretKey);
      } catch (err) {
        error = err;
      }
    });

    then('the deletion should fail', () => {
      expect(error).toBeDefined();
      expect(result).toBeNull();
    });

    and('I should receive a not found error', () => {
      expect(error.message).toMatch(/not found|does not exist/i);
    });
  });

  test('Fail to delete employee without authorization', ({ given, when, then, and }) => {
    given('I am not an administrator', () => {
      secretKey = 'invalid_secret_key';
    });

    when('I try to delete an employee', async () => {
      try {
        await useCase.execute(cpf, secretKey);
      } catch (err) {
        error = err;
      }
    });

    then('the deletion should fail', () => {
      expect(error).toBeDefined();
      expect(result).toBeNull();
    });

    and('I should receive an unauthorized error', () => {
      expect(error.message).toMatch(/forbidden|unauthorized|invalid.*key/i);
    });
  });
});