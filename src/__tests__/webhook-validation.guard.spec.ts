import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { WebhookValidationGuard } from '../guards/webhook-validation.guard';

describe('WebhookValidationGuard', () => {
  let guard: WebhookValidationGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhookValidationGuard,
        Reflector,
      ],
    }).compile();

    guard = module.get<WebhookValidationGuard>(WebhookValidationGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    let mockContext: ExecutionContext;
    let mockRequest: any;

    beforeEach(() => {
      mockRequest = {
        method: 'POST',
        url: '/webhook/test',
        headers: {
          'content-type': 'application/json',
          'x-n8n-webhook': 'true',
        },
        body: { test: 'data' },
      };

      mockContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
        getHandler: jest.fn(),
        getClass: jest.fn(),
      } as any;
    });

    it('should allow access when no webhook validation is required', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue(undefined);

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('should validate webhook when decorator is present with workflowId', async () => {
      const webhookConfig = {
        workflowId: 'workflow-1',
      };

      // Add workflowId to request body to match the expected workflowId
      mockRequest.body = { workflowId: 'workflow-1', test: 'data' };

      jest.spyOn(reflector, 'get').mockReturnValue(webhookConfig);

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('should deny access when workflowId does not match', async () => {
      const webhookConfig = {
        workflowId: 'workflow-1',
      };

      // Request has different workflowId
      mockRequest.body = { workflowId: 'workflow-2', test: 'data' };

      jest.spyOn(reflector, 'get').mockReturnValue(webhookConfig);

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(false);
    });

    it('should deny access when signature is required but missing', async () => {
      const webhookConfig = {
        validateSignature: true,
      };

      // Remove signature header
      delete mockRequest.headers['x-n8n-signature'];

      jest.spyOn(reflector, 'get').mockReturnValue(webhookConfig);

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(false);
    });

    it('should allow access when signature is present and validation is required', async () => {
      const webhookConfig = {
        validateSignature: true,
      };

      // Add signature header
      mockRequest.headers['x-n8n-signature'] = 'valid-signature';

      jest.spyOn(reflector, 'get').mockReturnValue(webhookConfig);

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
    });
  });
});