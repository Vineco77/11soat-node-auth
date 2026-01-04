import { JwtPayload } from '../../../src/core/domain/interfaces/jwt-payload.interface';

export const createMockJwtService = () => {
  return {
    createToken: jest.fn().mockImplementation((payload: any) => {
      return Promise.resolve('mock_jwt_token');
    }),

    validateToken: jest.fn().mockImplementation((token: string) => {
      if (token === 'valid_token') {
        const payload: JwtPayload = {
          sub: 'test_subject',
          cpf: 'test_cpf',
          user_type: 'cliente',
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 3600
        };
        return Promise.resolve(payload);
      }
      throw new Error('Invalid token');
    }),

    decodeToken: jest.fn().mockImplementation((token: string) => {
      if (token === 'valid_token') {
        return {
          sub: 'test_subject',
          cpf: 'test_cpf',
          user_type: 'cliente'
        };
      }
      return null;
    })
  };
};

export const createMockJwtServiceWithError = () => {
  return {
    createToken: jest.fn().mockRejectedValue(new Error('Token creation failed')),
    validateToken: jest.fn().mockRejectedValue(new Error('Token validation failed')),
    decodeToken: jest.fn().mockReturnValue(null)
  };
};