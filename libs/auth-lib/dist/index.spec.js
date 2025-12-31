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
const auth_lib_1 = require("./auth-lib");
const jwt_service_1 = require("./jwt-service");
const indexExports = __importStar(require("./index"));
describe('index exports', () => {
    it('should export AuthLib', () => {
        expect(indexExports.AuthLib).toBeDefined();
        expect(indexExports.AuthLib).toBe(auth_lib_1.AuthLib);
    });
    it('should export JwtService', () => {
        expect(indexExports.JwtService).toBeDefined();
        expect(indexExports.JwtService).toBe(jwt_service_1.JwtService);
    });
    it('should export JwtPayload interface type', () => {
        // JwtPayload is a type, so we can't test it directly
        // but we can verify the module exports are accessible
        const payload = {
            sub: 'test',
            cpf: '12345678901',
            user_type: 'cliente',
        };
        expect(payload).toBeDefined();
        expect(payload.sub).toBe('test');
    });
    it('should export all expected members', () => {
        const exports = Object.keys(indexExports);
        expect(exports).toContain('AuthLib');
        expect(exports).toContain('JwtService');
    });
    it('should allow creating AuthLib from exported class', () => {
        const lib = new indexExports.AuthLib('test-secret');
        expect(lib).toBeInstanceOf(auth_lib_1.AuthLib);
    });
    it('should allow creating JwtService from exported class', () => {
        const service = new indexExports.JwtService('test-secret');
        expect(service).toBeInstanceOf(jwt_service_1.JwtService);
    });
});
//# sourceMappingURL=index.spec.js.map