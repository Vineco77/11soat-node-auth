import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('checkHealth', () => {
    it('should return health status object', () => {
      const result = controller.checkHealth();

      expect(result).toBeDefined();
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('service');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('endpoints');
    });

    it('should return status as healthy', () => {
      const result = controller.checkHealth();

      expect(result.status).toBe('healthy');
    });

    it('should return service name as auth-service', () => {
      const result = controller.checkHealth();

      expect(result.service).toBe('auth-service');
    });

    it('should return timestamp in ISO format', () => {
      const result = controller.checkHealth();

      expect(result.timestamp).toBeDefined();
      expect(typeof result.timestamp).toBe('string');
      expect(() => new Date(result.timestamp)).not.toThrow();
      expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
    });

    it('should return endpoints object with all required endpoints', () => {
      const result = controller.checkHealth();

      expect(result.endpoints).toBeDefined();
      expect(result.endpoints).toHaveProperty('token');
      expect(result.endpoints).toHaveProperty('validate');
      expect(result.endpoints).toHaveProperty('employees');
    });

    it('should return correct endpoint paths', () => {
      const result = controller.checkHealth();

      expect(result.endpoints.token).toBe('/auth/token');
      expect(result.endpoints.validate).toBe('/auth/validate');
      expect(result.endpoints.employees).toBe('/employees');
    });

    it('should return a new timestamp on each call', () => {
      const result1 = controller.checkHealth();
      
      // Small delay to ensure different timestamps
      const startTime = Date.now();
      while (Date.now() - startTime < 10) {
        // wait
      }
      
      const result2 = controller.checkHealth();

      expect(result1.timestamp).not.toBe(result2.timestamp);
    });

    it('should have all properties with correct types', () => {
      const result = controller.checkHealth();

      expect(typeof result.status).toBe('string');
      expect(typeof result.service).toBe('string');
      expect(typeof result.timestamp).toBe('string');
      expect(typeof result.endpoints).toBe('object');
      expect(typeof result.endpoints.token).toBe('string');
      expect(typeof result.endpoints.validate).toBe('string');
      expect(typeof result.endpoints.employees).toBe('string');
    });
  });
});
