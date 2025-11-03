import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { N8nClientService } from '../services/n8n-client.service';
import { N8N_MODULE_OPTIONS } from '../constants/n8n.constants';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';

describe('N8nClientService', () => {
  let service: N8nClientService;
  let httpService: HttpService;

  const mockConfig = {
    baseUrl: 'http://localhost:5678',
    apiKey: 'test-api-key',
    timeout: 30000,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        N8nClientService,
        {
          provide: N8N_MODULE_OPTIONS,
          useValue: mockConfig,
        },
        {
          provide: HttpService,
          useValue: {
            request: jest.fn(),
            get: jest.fn(),
            post: jest.fn(),
            put: jest.fn(),
            patch: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<N8nClientService>(N8nClientService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('workflows()', () => {
    it('should return WorkflowService instance', () => {
      const workflowService = service.workflows();
      expect(workflowService).toBeDefined();
      expect(typeof workflowService.list).toBe('function');
      expect(typeof workflowService.get).toBe('function');
      expect(typeof workflowService.create).toBe('function');
      expect(typeof workflowService.update).toBe('function');
      expect(typeof workflowService.delete).toBe('function');
    });
  });

  describe('executions()', () => {
    it('should return ExecutionService instance', () => {
      const executionService = service.executions();
      expect(executionService).toBeDefined();
      expect(typeof executionService.list).toBe('function');
      expect(typeof executionService.get).toBe('function');
      expect(typeof executionService.delete).toBe('function');
    });
  });

  describe('credentials()', () => {
    it('should return CredentialService instance', () => {
      const credentialService = service.credentials();
      expect(credentialService).toBeDefined();
      expect(typeof credentialService.list).toBe('function');
      expect(typeof credentialService.get).toBe('function');
      expect(typeof credentialService.create).toBe('function');
      expect(typeof credentialService.delete).toBe('function');
    });
  });

  describe('tags()', () => {
    it('should return TagService instance', () => {
      const tagService = service.tags();
      expect(tagService).toBeDefined();
      expect(typeof tagService.list).toBe('function');
      expect(typeof tagService.get).toBe('function');
      expect(typeof tagService.create).toBe('function');
      expect(typeof tagService.delete).toBe('function');
    });
  });

  describe('webhooks()', () => {
    it('should return WebhookService instance', () => {
      const webhookService = service.webhooks();
      expect(webhookService).toBeDefined();
      expect(typeof webhookService.validate).toBe('function');
      expect(typeof webhookService.process).toBe('function');
    });
  });

  describe('HTTP methods', () => {
    const mockResponse: AxiosResponse = {
      data: { success: true },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: {} as any,
      },
    };

    beforeEach(() => {
      jest.spyOn(httpService, 'request').mockReturnValue(of(mockResponse));
    });

    it('should make GET request', async () => {
      const result = await service.get('/test-endpoint');

      expect(httpService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: 'http://localhost:5678/test-endpoint',
          headers: expect.objectContaining({
            'X-N8N-API-KEY': 'test-api-key',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }),
        })
      );
      expect(result).toEqual({ success: true });
    });

    it('should make POST request', async () => {
      const testData = { name: 'Test Workflow' };
      const result = await service.post('/test-endpoint', testData);

      expect(httpService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: 'http://localhost:5678/test-endpoint',
          data: testData,
          headers: expect.objectContaining({
            'X-N8N-API-KEY': 'test-api-key',
          }),
        })
      );
      expect(result).toEqual({ success: true });
    });

    it('should make PUT request', async () => {
      const testData = { name: 'Updated Workflow' };
      const result = await service.put('/test-endpoint', testData);

      expect(httpService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PUT',
          url: 'http://localhost:5678/test-endpoint',
          data: testData,
        })
      );
      expect(result).toEqual({ success: true });
    });

    it('should make PATCH request', async () => {
      const testData = { active: true };
      const result = await service.patch('/test-endpoint', testData);

      expect(httpService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PATCH',
          url: 'http://localhost:5678/test-endpoint',
          data: testData,
        })
      );
      expect(result).toEqual({ success: true });
    });

    it('should make DELETE request', async () => {
      const result = await service.delete('/test-endpoint');

      expect(httpService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'DELETE',
          url: 'http://localhost:5678/test-endpoint',
        })
      );
      expect(result).toEqual({ success: true });
    });
  });

  describe('Error handling', () => {
    it('should handle 401 authentication error', async () => {
      const authError = {
        response: {
          status: 401,
          statusText: 'Unauthorized',
          data: { message: 'Invalid API key' },
        },
      };

      jest.spyOn(httpService, 'request').mockReturnValue(
        throwError(() => authError)
      );

      await expect(service.get('/test-endpoint')).rejects.toThrow(
        expect.objectContaining({
          name: 'N8nAuthenticationError',
        })
      );
    });

    it('should handle 404 not found error', async () => {
      const notFoundError = {
        response: {
          status: 404,
          statusText: 'Not Found',
        },
      };

      jest.spyOn(httpService, 'request').mockReturnValue(
        throwError(() => notFoundError)
      );

      await expect(service.get('/test-endpoint')).rejects.toThrow(
        'N8N API endpoint not found'
      );
    });

    it('should handle connection error', async () => {
      const connectionError = {
        request: {},
        message: 'Network Error',
      };

      jest.spyOn(httpService, 'request').mockReturnValue(
        throwError(() => connectionError)
      );

      await expect(service.get('/test-endpoint')).rejects.toThrow(
        expect.objectContaining({
          name: 'N8nConnectionError',
        })
      );
    });
  });
});