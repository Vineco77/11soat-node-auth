"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_service_1 = require("./jwt-service");
const jwt = __importStar(require("jsonwebtoken"));
jest.mock('jsonwebtoken');
describe('JwtService', () => {
    let service;
    const mockSecret = 'test-jwt-secret';
    beforeEach(() => {
        service = new jwt_service_1.JwtService(mockSecret);
        jest.clearAllMocks();
    });
    describe('constructor', () => {
        it('should create service with valid secret', () => {
            const jwtService = new jwt_service_1.JwtService('valid-secret');
            expect(jwtService).toBeDefined();
            expect(jwtService.secret).toBe('valid-secret');
        });
        it('should throw error if secret is not provided', () => {
            expect(() => new jwt_service_1.JwtService('')).toThrow('JWT_SECRET is required');
        });
        it('should throw error if secret is null', () => {
            expect(() => new jwt_service_1.JwtService(null)).toThrow('JWT_SECRET is required');
        });
        it('should throw error if secret is undefined', () => {
            expect(() => new jwt_service_1.JwtService(undefined)).toThrow('JWT_SECRET is required');
        });
        it('should accept any string as secret', () => {
            const service1 = new jwt_service_1.JwtService('short');
            const service2 = new jwt_service_1.JwtService('a'.repeat(100));
            expect(service1.secret).toBe('short');
            expect(service2.secret).toBe('a'.repeat(100));
        });
    });
    describe('createToken', () => {
        const mockPayload = {
            sub: '12345678901',
            cpf: '12345678901',
            user_type: 'cliente',
            name: 'John Doe',
        };
        it('should create a JWT token successfully', async () => {
            const mockToken = 'generated.jwt.token';
            jwt.sign.mockReturnValue(mockToken);
            const result = await service.createToken(mockPayload);
            expect(jwt.sign).toHaveBeenCalledWith(mockPayload, mockSecret, expect.objectContaining({
                expiresIn: '15m',
                issuer: 'auth-service',
            }));
            expect(result).toBe(mockToken);
        });
        it('should create token for employee', async () => {
            const employeePayload = {
                sub: '98765432109',
                cpf: '98765432109',
                user_type: 'funcionario',
                name: 'Jane Employee',
            };
            const mockToken = 'employee.jwt.token';
            jwt.sign.mockReturnValue(mockToken);
            const result = await service.createToken(employeePayload);
            expect(result).toBe(mockToken);
            expect(jwt.sign).toHaveBeenCalledWith(employeePayload, mockSecret, expect.any(Object));
        });
        it('should create token without name', async () => {
            const payloadWithoutName = {
                sub: 'client_uuid',
                cpf: '',
                user_type: 'cliente',
            };
            const mockToken = 'client.jwt.token';
            jwt.sign.mockReturnValue(mockToken);
            const result = await service.createToken(payloadWithoutName);
            expect(result).toBe(mockToken);
            expect(jwt.sign).toHaveBeenCalledWith(payloadWithoutName, mockSecret, expect.any(Object));
        });
        it('should throw error if jwt.sign fails', async () => {
            const error = new Error('Signing failed');
            jwt.sign.mockImplementation(() => {
                throw error;
            });
            await expect(service.createToken(mockPayload)).rejects.toThrow('Failed to create JWT token: Signing failed');
        });
        it('should handle non-Error exceptions', async () => {
            jwt.sign.mockImplementation(() => {
                throw 'String error';
            });
            await expect(service.createToken(mockPayload)).rejects.toThrow('Failed to create JWT token: String error');
        });
        it('should create token with empty cpf for anonymous client', async () => {
            const anonymousPayload = {
                sub: 'temp_id',
                cpf: '',
                user_type: 'cliente',
            };
            const mockToken = 'anonymous.token';
            jwt.sign.mockReturnValue(mockToken);
            const result = await service.createToken(anonymousPayload);
            expect(result).toBe(mockToken);
        });
    });
    describe('validateToken', () => {
        const validToken = 'valid.jwt.token';
        const mockDecodedPayload = {
            sub: '12345678901',
            cpf: '12345678901',
            user_type: 'cliente',
            name: 'John Doe',
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 900,
        };
        it('should validate token successfully', async () => {
            jwt.verify.mockReturnValue(mockDecodedPayload);
            const result = await service.validateToken(validToken);
            expect(jwt.verify).toHaveBeenCalledWith(validToken, mockSecret);
            expect(result).toEqual(mockDecodedPayload);
        });
        it('should validate employee token', async () => {
            const employeePayload = {
                ...mockDecodedPayload,
                cpf: '98765432109',
                user_type: 'funcionario',
            };
            jwt.verify.mockReturnValue(employeePayload);
            const result = await service.validateToken(validToken);
            expect(result.user_type).toBe('funcionario');
            expect(result).toEqual(employeePayload);
        });
        it('should validate client token without CPF', async () => {
            const clientPayload = {
                sub: 'client_uuid',
                cpf: '',
                user_type: 'cliente',
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + 900,
            };
            jwt.verify.mockReturnValue(clientPayload);
            const result = await service.validateToken(validToken);
            expect(result.cpf).toBe('');
            expect(result.user_type).toBe('cliente');
        });
        it('should throw error for expired token', async () => {
            const expiredError = new jwt.TokenExpiredError('Token expired', new Date());
            jwt.verify.mockImplementation(() => {
                throw expiredError;
            });
            await expect(service.validateToken(validToken)).rejects.toThrow('Token expired');
        });
        it('should throw error for invalid token', async () => {
            const invalidError = new jwt.JsonWebTokenError('Invalid token');
            jwt.verify.mockImplementation(() => {
                throw invalidError;
            });
            await expect(service.validateToken(validToken)).rejects.toThrow('Invalid token');
        });
        it('should throw error for unexpected errors', async () => {
            const unexpectedError = new Error('Unexpected error');
            jwt.verify.mockImplementation(() => {
                throw unexpectedError;
            });
            await expect(service.validateToken(validToken)).rejects.toThrow('Token validation failed: Unexpected error');
        });
        it('should handle non-Error exceptions during validation', async () => {
            jwt.verify.mockImplementation(() => {
                throw 'String error';
            });
            await expect(service.validateToken(validToken)).rejects.toThrow('Token validation failed: String error');
        });
        it('should validate token without name', async () => {
            const payloadWithoutName = {
                sub: '12345678901',
                cpf: '12345678901',
                user_type: 'cliente',
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + 900,
            };
            jwt.verify.mockReturnValue(payloadWithoutName);
            const result = await service.validateToken(validToken);
            expect(result.name).toBeUndefined();
        });
    });
    describe('decodeToken', () => {
        const validToken = 'valid.jwt.token';
        const mockDecodedPayload = {
            sub: '12345678901',
            cpf: '12345678901',
            user_type: 'cliente',
            name: 'John Doe',
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 900,
        };
        it('should decode token successfully', () => {
            jwt.decode.mockReturnValue(mockDecodedPayload);
            const result = service.decodeToken(validToken);
            expect(jwt.decode).toHaveBeenCalledWith(validToken);
            expect(result).toEqual(mockDecodedPayload);
        });
        it('should decode employee token', () => {
            const employeePayload = {
                ...mockDecodedPayload,
                user_type: 'funcionario',
            };
            jwt.decode.mockReturnValue(employeePayload);
            const result = service.decodeToken(validToken);
            expect(result?.user_type).toBe('funcionario');
        });
        it('should return null if decoding fails', () => {
            jwt.decode.mockImplementation(() => {
                throw new Error('Decode failed');
            });
            const result = service.decodeToken('invalid.token');
            expect(result).toBeNull();
        });
        it('should return null for malformed token', () => {
            jwt.decode.mockReturnValue(null);
            const result = service.decodeToken('malformed');
            expect(result).toBeNull();
        });
        it('should decode token without name', () => {
            const payloadWithoutName = {
                sub: '12345678901',
                cpf: '12345678901',
                user_type: 'cliente',
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + 900,
            };
            jwt.decode.mockReturnValue(payloadWithoutName);
            const result = service.decodeToken(validToken);
            expect(result?.name).toBeUndefined();
        });
        it('should handle any exception during decode', () => {
            jwt.decode.mockImplementation(() => {
                throw 'Any error';
            });
            const result = service.decodeToken('bad.token');
            expect(result).toBeNull();
        });
        it('should decode token with empty cpf', () => {
            const payload = {
                sub: 'temp_id',
                cpf: '',
                user_type: 'cliente',
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + 900,
            };
            jwt.decode.mockReturnValue(payload);
            const result = service.decodeToken(validToken);
            expect(result?.cpf).toBe('');
        });
    });
    describe('integration scenarios', () => {
        it('should handle full token lifecycle', async () => {
            const payload = {
                sub: '12345678901',
                cpf: '12345678901',
                user_type: 'cliente',
                name: 'Test User',
            };
            const mockToken = 'test.token';
            jwt.sign.mockReturnValue(mockToken);
            const token = await service.createToken(payload);
            expect(token).toBe(mockToken);
            const decodedPayload = {
                ...payload,
                iat: Date.now(),
                exp: Date.now() + 900,
            };
            jwt.verify.mockReturnValue(decodedPayload);
            const validated = await service.validateToken(token);
            expect(validated.sub).toBe(payload.sub);
            jwt.decode.mockReturnValue(decodedPayload);
            const decoded = service.decodeToken(token);
            expect(decoded?.cpf).toBe(payload.cpf);
        });
    });
});
//# sourceMappingURL=jwt-service.spec.js.map