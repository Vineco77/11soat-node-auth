import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  checkHealth() {
    return {
      status: 'healthy',
      service: 'auth-service',
      timestamp: new Date().toISOString(),
      endpoints: {
        token: '/auth/token',
        validate: '/auth/validate',
        employees: '/employees'
      }
    };
  }
}