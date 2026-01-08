import { UserEntity } from '../../../src/core/domain/entities/user.entity';

export class UserFactory {
  static generateValidCPF(): string {
    const base = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
    
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += base[i] * (10 - i);
    }
    let remainder = sum % 11;
    const firstDigit = remainder < 2 ? 0 : 11 - remainder;
    
    sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += base[i] * (11 - i);
    }
    sum += firstDigit * 2;
    remainder = sum % 11;
    const secondDigit = remainder < 2 ? 0 : 11 - remainder;
    
    return [...base, firstDigit, secondDigit].join('');
  }

  static createUser(overrides: Partial<{ id: number | null; cpf: string; name: string }> = {}): UserEntity {
    const defaults = {
      id: 1,
      cpf: this.generateValidCPF(),
      name: 'Test User'
    };

    const data = { ...defaults, ...overrides };
    return new UserEntity(data.id, data.cpf, data.name);
  }

  static createEmployeeData(): { cpf: string; name: string } {
    return {
      cpf: this.generateValidCPF(),
      name: 'Employee Name'
    };
  }

  static createInvalidCPFData(): { cpf: string; name: string } {
    return {
      cpf: 'invalid',
      name: 'Test User'
    };
  }

  static createUserWithoutCPF(): { name?: string; email?: string } {
    return {
      name: 'Client User',
      email: 'client@example.com'
    };
  }

  static generateCPF(): string {
    return this.generateValidCPF();
  }
}