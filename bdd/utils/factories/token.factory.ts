import * as jwt from 'jsonwebtoken';

export class TokenFactory {
  private static readonly secret = 'test-secret-key';

  static createValidToken(payloadOverrides: Partial<any> = {}): string {
    const payload = {
      sub: 'valid_cpf_here',
      cpf: 'valid_cpf_here',
      user_type: 'cliente',
      name: 'Test User',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
      ...payloadOverrides
    };

    return jwt.sign(payload, this.secret);
  }

  static createExpiredToken(): string {
    const payload = {
      sub: 'valid_cpf_here',
      cpf: 'valid_cpf_here',
      user_type: 'cliente',
      name: 'Test User',
      iat: Math.floor(Date.now() / 1000) - 7200, // 2 hours ago
      exp: Math.floor(Date.now() / 1000) - 3600  // 1 hour ago
    };

    return jwt.sign(payload, this.secret);
  }

  static createInvalidToken(): string {
    const payload = {
      sub: 'valid_cpf_here',
      cpf: 'valid_cpf_here',
      user_type: 'cliente',
      name: 'Test User'
    };

    return jwt.sign(payload, 'wrong-secret');
  }

  static createEmployeeToken(): string {
    return this.createValidToken({
      user_type: 'funcionario'
    });
  }

  static createClientToken(): string {
    return this.createValidToken({
      user_type: 'cliente'
    });
  }
}