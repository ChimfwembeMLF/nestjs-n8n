import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { WorkflowService } from '../services/workflow.service';
import { N8nClientService } from '../services/n8n-client.service';
import { N8N_MODULE_OPTIONS } from '../constants/n8n.constants';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';
import { CreateWorkflowDto, UpdateWorkflowDto } from '../dto';

describe('WorkflowService', () => {
  let service: WorkflowService;
  let n8nClient: N8nClientService;

  const mockConfig = {
    baseUrl: 'http://localhost:5678',
    apiKey: 'test-api-key',
    timeout: 30000,
  };

  const mockWorkflow = {
    id: '1',
    name: 'Test Workflow',
    active: false,
    nodes: [],
    connections: {},
    settings: {},
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
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
    service = n8nClient.workflows();

    // Mock the HTTP service methods
    jest.spyOn(n8nClient, 'get').mockImplementation(async () => mockWorkflow);
    jest.spyOn(n8nClient, 'post').mockImplementation(async () => mockWorkflow);
    jest.spyOn(n8nClient, 'put').mockImplementation(async () => mockWorkflow);
    jest.spyOn(n8nClient, 'patch').mockImplementation(async () => mockWorkflow);
    jest.spyOn(n8nClient, 'delete').mockImplementation(async () => ({}));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('list()', () => {
    it('should list all workflows', async () => {
      const mockWorkflows = { data: [mockWorkflow] };
      jest.spyOn(n8nClient, 'get').mockResolvedValue(mockWorkflows);

      const result = await service.list();

      expect(n8nClient.get).toHaveBeenCalledWith('/api/v1/workflows');
      expect(result).toEqual(mockWorkflows);
    });

    it('should list workflows with limit and cursor', async () => {
      const mockWorkflows = { data: [mockWorkflow] };
      jest.spyOn(n8nClient, 'get').mockResolvedValue(mockWorkflows);

      const result = await service.list(10, 'cursor123');

      expect(n8nClient.get).toHaveBeenCalledWith('/api/v1/workflows?limit=10&cursor=cursor123');
      expect(result).toEqual(mockWorkflows);
    });

    it('should list workflows with just limit', async () => {
      const mockWorkflows = { data: [mockWorkflow] };
      jest.spyOn(n8nClient, 'get').mockResolvedValue(mockWorkflows);

      const result = await service.list(5);

      expect(n8nClient.get).toHaveBeenCalledWith('/api/v1/workflows?limit=5');
      expect(result).toEqual(mockWorkflows);
    });
  });

  describe('get()', () => {
    it('should get workflow by id', async () => {
      const result = await service.get('1');

      expect(n8nClient.get).toHaveBeenCalledWith('/api/v1/workflows/1');
      expect(result).toEqual(mockWorkflow);
    });

    it('should throw error for invalid id', async () => {
      await expect(service.get('')).rejects.toThrow('Workflow ID is required');
    });
  });

  describe('create()', () => {
    it('should create a new workflow', async () => {
      const createDto: CreateWorkflowDto = {
        name: 'New Workflow',
        nodes: [],
        connections: {},
      };

      const result = await service.create(createDto);

      expect(n8nClient.post).toHaveBeenCalledWith('/api/v1/workflows', createDto);
      expect(result).toEqual(mockWorkflow);
    });

    it('should validate required fields', async () => {
      const invalidDto = {} as CreateWorkflowDto;

      await expect(service.create(invalidDto)).rejects.toThrow();
    });
  });

  describe('update()', () => {
    it('should update workflow by id', async () => {
      const updateDto: UpdateWorkflowDto = {
        name: 'Updated Workflow',
        active: true,
      };

      const result = await service.update('1', updateDto);

      expect(n8nClient.patch).toHaveBeenCalledWith('/api/v1/workflows/1', updateDto);
      expect(result).toEqual(mockWorkflow);
    });

    it('should throw error for invalid id', async () => {
      const updateDto: UpdateWorkflowDto = { name: 'Updated' };

      await expect(service.update('', updateDto)).rejects.toThrow('Workflow ID is required');
    });
  });

  describe('delete()', () => {
    it('should delete workflow by id', async () => {
      const result = await service.delete('1');

      expect(n8nClient.delete).toHaveBeenCalledWith('/api/v1/workflows/1');
      expect(result).toEqual({});
    });

    it('should throw error for invalid id', async () => {
      await expect(service.delete('')).rejects.toThrow('Workflow ID is required');
    });
  });

  describe('activate()', () => {
    it('should activate workflow', async () => {
      const result = await service.activate('1');

      expect(n8nClient.patch).toHaveBeenCalledWith('/api/v1/workflows/1', { active: true });
      expect(result).toEqual(mockWorkflow);
    });

    it('should throw error for invalid id', async () => {
      await expect(service.activate('')).rejects.toThrow('Workflow ID is required');
    });
  });

  describe('deactivate()', () => {
    it('should deactivate workflow', async () => {
      const result = await service.deactivate('1');

      expect(n8nClient.patch).toHaveBeenCalledWith('/api/v1/workflows/1', { active: false });
      expect(result).toEqual(mockWorkflow);
    });

    it('should throw error for invalid id', async () => {
      await expect(service.deactivate('')).rejects.toThrow('Workflow ID is required');
    });
  });

  describe('execute()', () => {
    it('should execute workflow', async () => {
      const mockExecution = {
        id: 'exec-1',
        workflowId: '1',
        mode: 'manual',
        status: 'running',
        createdAt: '2023-01-01T00:00:00.000Z',
      };

      jest.spyOn(n8nClient, 'post').mockResolvedValue(mockExecution);

      const result = await service.execute('1');

      expect(n8nClient.post).toHaveBeenCalledWith('/api/v1/workflows/1/execute');
      expect(result).toEqual(mockExecution);
    });
  });

  describe('tags()', () => {
    it('should get workflow tags', async () => {
      const workflowWithTags = { ...mockWorkflow, tags: ['tag1', 'tag2'] };
      jest.spyOn(n8nClient, 'get').mockResolvedValue(workflowWithTags);

      const result = await service.tags('1');

      expect(n8nClient.get).toHaveBeenCalledWith('/api/v1/workflows/1');
      expect(result).toEqual(['tag1', 'tag2']);
    });

    it('should return empty array for workflow without tags', async () => {
      jest.spyOn(n8nClient, 'get').mockResolvedValue(mockWorkflow);

      const result = await service.tags('1');

      expect(result).toEqual([]);
    });
  });
});