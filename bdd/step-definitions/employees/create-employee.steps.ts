import { loadFeature, defineFeature } from 'jest-cucumber';
import { CreateEmployeeUseCase } from '../../../src/core/application/use-cases/create-employee.use-case';
import { UserFactory } from '../../utils/factories/user.factory';
import { createMockUserRepository, createMockUserRepositoryWithEmployee } from '../../utils/mocks/user-repository.mock';
import { resolveFeaturePath } from '../../utils/paths';

const feature = loadFeature(resolveFeaturePath('features/employees/create-employee.feature'));

defineFeature(feature, (test) => {
  let useCase: CreateEmployeeUseCase;
  let mockUserRepository: any;
  let employeeData: any;
  let secretKey: string;
  let result: any;
  let error: any;

  beforeEach(() => {
    mockUserRepository = createMockUserRepository();
    useCase = new CreateEmployeeUseCase(mockUserRepository);
    
    secretKey = process.env.ADMIN_SECRET_KEY!;
    employeeData = UserFactory.createEmployeeData();
    
    error = null;
    result = null;
  });

  test('Successfully create employee', ({ given, when, then, and }) => {
    given('I am an administrator with valid secret key', () => {
    });

    and('no employee exists with the provided CPF', () => {
      mockUserRepository.findByCpf.mockResolvedValue(null);
    });

    when('I create an employee', async () => {
      try {
        result = await useCase.execute(
          employeeData.cpf,
          employeeData.name,
          secretKey
        );
      } catch (err) {
        error = err;
      }
    });

    then('the employee should be created successfully', () => {
      expect(error).toBeNull();
      expect(result).toBeDefined();
      expect(mockUserRepository.create).toHaveBeenCalled();
    });

    and('I should receive the employee ID', () => {
      expect(result).toBeDefined();
      expect(result.cpf).toBe(employeeData.cpf);
      expect(result.name).toBe(employeeData.name);
    });
  });

  test('Fail to create employee with existing CPF', ({ given, when, then, and }) => {
    given('I am an administrator with valid secret key', () => {
    });

    and('an employee already exists with the provided CPF', () => {
      mockUserRepository = createMockUserRepositoryWithEmployee(employeeData.cpf);
      useCase = new CreateEmployeeUseCase(mockUserRepository);
    });

    when('I try to create an employee', async () => {
      try {
        result = await useCase.execute(
          employeeData.cpf,
          employeeData.name,
          secretKey
        );
      } catch (err) {
        error = err;
      }
    });

    then('the creation should fail', () => {
      expect(error).toBeDefined();
      expect(result).toBeNull();
    });

    and('I should receive a conflict error', () => {
      expect(error.message).toMatch(/conflict|already exists|CPF/i);
    });
  });

  test('Fail to create employee without authorization', ({ given, when, then, and }) => {
    given('I am not an administrator', () => {
      secretKey = 'invalid_secret_key';
    });

    when('I try to create an employee', async () => {
      try {
        result = await useCase.execute(
          employeeData.cpf,
          employeeData.name,
          secretKey
        );
      } catch (err) {
        error = err;
      }
    });

    then('the creation should fail', () => {
      expect(error).toBeDefined();
      expect(result).toBeNull();
    });

    and('I should receive an unauthorized error', () => {
      expect(error.message).toMatch(/forbidden|unauthorized|invalid.*key/i);
    });
  });

  test('Fail to create employee with invalid CPF format', ({ given, when, then, and }) => {
    given('I am an administrator with valid secret key', () => {
      // Already set in beforeEach
    });

    and('I provide invalid CPF format', () => {
      employeeData = UserFactory.createInvalidCPFData();
    });

    when('I try to create an employee', async () => {
      try {
        result = await useCase.execute(
          employeeData.cpf,
          employeeData.name,
          secretKey
        );
      } catch (err) {
        error = err;
      }
    });

    then('the creation should fail', () => {
      expect(error).toBeDefined();
      expect(result).toBeNull();
    });

    and('I should receive a validation error', () => {
      expect(error.message).toMatch(/invalid|CPF|format|validation/i);
    });
  });
});