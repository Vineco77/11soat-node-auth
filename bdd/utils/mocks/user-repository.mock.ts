import { UserEntity } from '../../../src/core/domain/entities/user.entity';
import { AppError } from '../../../src/core/domain/errors/app.error';

const isValidCPF = (cpf: string): boolean => {
  const cleanCpf = cpf.replaceAll(/[^\d]+/g, '');
  
  if (cleanCpf.length !== 11) {
    return false;
  }
  
  if (/^(\d)\1+$/.test(cleanCpf)) {
    return false;
  }
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += Number.parseInt(cleanCpf.charAt(i)) * (10 - i);
  }
  let remainder = sum % 11;
  const firstDigit = remainder < 2 ? 0 : 11 - remainder;
  
  if (firstDigit !== Number.parseInt(cleanCpf.charAt(9))) {
    return false;
  }
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += Number.parseInt(cleanCpf.charAt(i)) * (11 - i);
  }
  remainder = sum % 11;
  const secondDigit = remainder < 2 ? 0 : 11 - remainder;
  
  return secondDigit === Number.parseInt(cleanCpf.charAt(10));
};

export const createMockUserRepository = () => {
  const employees = new Map<string, UserEntity>();
  
  return {
    create: jest.fn().mockImplementation((user: UserEntity) => {
      if (!isValidCPF(user.cpf)) {
        throw AppError.badRequest({
          message: 'Invalid CPF format. CPF must have exactly 11 numeric digits',
        });
      }
      
      employees.set(user.cpf, user);
      return Promise.resolve(user);
    }),

    findByCpf: jest.fn().mockImplementation((cpf: string) => {
      const employee = employees.get(cpf);
      return Promise.resolve(employee || null);
    }),

    deleteByCpf: jest.fn().mockImplementation((cpf: string) => {
      employees.delete(cpf);
      return Promise.resolve();
    }),

    findAll: jest.fn().mockImplementation(() => {
      return Promise.resolve(Array.from(employees.values()));
    })
  };
};

export const createMockUserRepositoryWithEmployee = (cpf: string) => {
  const mock = createMockUserRepository();
  const employee = new UserEntity(1, cpf, 'Existing Employee');
  
  mock.findByCpf.mockImplementation((searchCpf: string) => {
    if (searchCpf === cpf) {
      return Promise.resolve(employee);
    }
    return Promise.resolve(null);
  });

  return mock;
};

export const createMockUserRepositoryWithError = () => {
  return {
    create: jest.fn().mockRejectedValue(new Error('Database error')),
    findByCpf: jest.fn().mockRejectedValue(new Error('Database error')),
    deleteByCpf: jest.fn().mockRejectedValue(new Error('Database error')),
    findAll: jest.fn().mockRejectedValue(new Error('Database error'))
  };
};