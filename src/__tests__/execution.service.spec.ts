import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ExecutionService } from '../services/execution.service';
import { N8nClientService } from '../services/n8n-client.service';
import { N8N_MODULE_OPTIONS } from '../constants/n8n.constants';

describe('ExecutionService', () => {
  let service: ExecutionService;
  let n8nClient: N8nClientService;

  const mockConfig = {
    baseUrl: 'http://localhost:5678',
    apiKey: 'test-api-key',
    timeout: 30000,
  };

  const mockExecution = {
    id: 'exec-1',
    workflowId: '1',
    mode: 'manual',
    status: 'success',
    startedAt: '2023-01-01T00:00:00.000Z',
    stoppedAt: '2023-01-01T00:01:00.000Z',
    data: {
      resultData: {
        runData: {},
      },
    },
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

    n8nClient = module.get<N8nClientService>(N8nClientService);
    service = n8nClient.executions();

    // Mock the HTTP service methods
    jest.spyOn(n8nClient, 'get').mockImplementation(async () => mockExecution);
    jest.spyOn(n8nClient, 'delete').mockImplementation(async () => ({}));
    jest.spyOn(n8nClient, 'post').mockImplementation(async () => mockExecution);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('list()', () => {
    it('should list all executions', async () => {
      const mockExecutions = { data: [mockExecution] };
      jest.spyOn(n8nClient, 'get').mockResolvedValue(mockExecutions);

      const result = await service.list();

      expect(n8nClient.get).toHaveBeenCalledWith('/api/v1/executions');
      expect(result).toEqual(mockExecutions);
    });

    it('should list executions with options', async () => {
      const mockExecutions = { data: [mockExecution] };
      jest.spyOn(n8nClient, 'get').mockResolvedValue(mockExecutions);

      const options = { limit: 10, cursor: 'cursor123', status: 'success' as const };
      const result = await service.list(options);

      expect(n8nClient.get).toHaveBeenCalledWith('/api/v1/executions?limit=10&cursor=cursor123&status=success');
      expect(result).toEqual(mockExecutions);
    });

    it('should list executions with workflowId filter', async () => {
      const mockExecutions = { data: [mockExecution] };
      jest.spyOn(n8nClient, 'get').mockResolvedValue(mockExecutions);

      const options = { workflowId: 'workflow-1', includeData: true };
      const result = await service.list(options);

      expect(n8nClient.get).toHaveBeenCalledWith('/api/v1/executions?workflowId=workflow-1&includeData=true');
      expect(result).toEqual(mockExecutions);
    });
  });

  describe('forWorkflow()', () => {
    it('should list executions for specific workflow', async () => {
      const mockExecutions = { data: [mockExecution] };
      jest.spyOn(n8nClient, 'get').mockResolvedValue(mockExecutions);

      const result = await service.forWorkflow('workflow-1', { limit: 5 });

      expect(n8nClient.get).toHaveBeenCalledWith('/api/v1/executions?limit=5&workflowId=workflow-1');
      expect(result).toEqual(mockExecutions);
    });
  });

  describe('get()', () => {
    it('should get execution by id', async () => {
      const result = await service.get('exec-1');

      expect(n8nClient.get).toHaveBeenCalledWith('/api/v1/executions/exec-1');
      expect(result).toEqual(mockExecution);
    });

    it('should get execution by id with data included', async () => {
      const result = await service.get('exec-1', true);

      expect(n8nClient.get).toHaveBeenCalledWith('/api/v1/executions/exec-1?includeData=true');
      expect(result).toEqual(mockExecution);
    });
  });

  describe('delete()', () => {
    it('should delete execution by id', async () => {
      const result = await service.delete('exec-1');

      expect(n8nClient.delete).toHaveBeenCalledWith('/api/v1/executions/exec-1');
      expect(result).toEqual({});
    });
  });

  describe('stop()', () => {
    it('should stop execution by id', async () => {
      const stoppedExecution = { ...mockExecution, status: 'canceled' };
      jest.spyOn(n8nClient, 'post').mockResolvedValue(stoppedExecution);

      const result = await service.stop('exec-1');

      expect(n8nClient.post).toHaveBeenCalledWith('/api/v1/executions/exec-1/stop');
      expect(result).toEqual(stoppedExecution);
    });
  });

  describe('retry()', () => {
    it('should retry execution by id', async () => {
      const retriedExecution = { ...mockExecution, id: 'exec-2', status: 'running' };
      jest.spyOn(n8nClient, 'post').mockResolvedValue(retriedExecution);

      const result = await service.retry('exec-1');

      expect(n8nClient.post).toHaveBeenCalledWith('/api/v1/executions/exec-1/retry');
      expect(result).toEqual(retriedExecution);
    });
  });
});