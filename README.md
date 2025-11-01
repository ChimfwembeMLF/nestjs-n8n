# NestJS N8N Client

A fluent NestJS client for [n8n](https://n8n.io) automation workflows. This package provides a comprehensive, type-safe interface for interacting with n8n's API, including workflows, executions, credentials, tags, and webhooks.

## Features

- 🚀 **Full n8n API Coverage** - Workflows, executions, credentials, tags, and more
- 🔒 **Type-Safe** - Complete TypeScript definitions for all API operations
- 🎯 **Fluent API** - Intuitive, chainable methods for easy integration
- 🪝 **Webhook Support** - Built-in decorators and guards for handling n8n webhooks
- ⚡ **Async Configuration** - Support for dynamic configuration with ConfigService
- 🧪 **Testable** - Designed with dependency injection for easy testing
- 📚 **Swagger/OpenAPI Documentation** - Full Swagger/OpenAPI support with pre-configured DTOs and decorators

## Installation

\`\`\`bash
npm install ChimfwembeMLF/nestjs-n8n
# or
yarn add ChimfwembeMLF/nestjs-n8n
# or
pnpm add ChimfwembeMLF/nestjs-n8n
\`\`\`nestjs-n8n

## Quick Start

### 1. Import the Module

\`\`\`typescript
import { Module } from '@nestjs/common';
import { N8nModule } from 'nestjs-n8n';

@Module({
  imports: [
    N8nModule.forRoot({
      baseUrl: 'https://your-n8n-instance.com',
      apiKey: 'your-api-key',
    }),
  ],
})
export class AppModule {}
\`\`\`

### 2. Async Configuration (Recommended)

\`\`\`typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { N8nModule } from 'nestjs-n8n';

@Module({
  imports: [
    ConfigModule.forRoot(),
    N8nModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        baseUrl: configService.get('N8N_BASE_URL'),
        apiKey: configService.get('N8N_API_KEY'),
        timeout: 30000,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
\`\`\`

### 3. Use in Your Service

\`\`\`typescript
import { Injectable } from '@nestjs/common';
import { N8nClientService } from 'nestjs-n8n';

@Injectable()
export class WorkflowService {
  constructor(private readonly n8nClient: N8nClientService) {}

  async getAllWorkflows() {
    return this.n8nClient.workflows().all();
  }

  async activateWorkflow(workflowId: string) {
    return this.n8nClient.workflows().activate(workflowId);
  }

  async executeWorkflow(workflowId: string, data: any) {
    return this.n8nClient.workflows().execute(workflowId, data);
  }
}
\`\`\`

## API Reference

### Workflows

\`\`\`typescript
// Get all workflows
const workflows = await n8nClient.workflows().all();

// Get a specific workflow
const workflow = await n8nClient.workflows().find('workflow-id');

// Create a workflow
const newWorkflow = await n8nClient.workflows().create({
  name: 'My Workflow',
  nodes: [...],
  connections: {...},
});

// Update a workflow
const updated = await n8nClient.workflows().update('workflow-id', {
  name: 'Updated Name',
});

// Delete a workflow
await n8nClient.workflows().delete('workflow-id');

// Activate/Deactivate
await n8nClient.workflows().activate('workflow-id');
await n8nClient.workflows().deactivate('workflow-id');

// Execute a workflow
const result = await n8nClient.workflows().execute('workflow-id', {
  data: { key: 'value' },
});
\`\`\`

### Executions

\`\`\`typescript
// Get all executions
const executions = await n8nClient.executions().all();

// Get executions for a workflow
const workflowExecutions = await n8nClient.executions().forWorkflow('workflow-id');

// Get a specific execution
const execution = await n8nClient.executions().find('execution-id');

// Delete an execution
await n8nClient.executions().delete('execution-id');

// Retry a failed execution
const retried = await n8nClient.executions().retry('execution-id');
\`\`\`

### Credentials

\`\`\`typescript
// Get all credentials
const credentials = await n8nClient.credentials().all();

// Get a specific credential
const credential = await n8nClient.credentials().find('credential-id');

// Create a credential
const newCredential = await n8nClient.credentials().create({
  name: 'My API Key',
  type: 'httpHeaderAuth',
  data: { name: 'Authorization', value: 'Bearer token' },
});

// Update a credential
await n8nClient.credentials().update('credential-id', {
  name: 'Updated Name',
});

// Delete a credential
await n8nClient.credentials().delete('credential-id');

// Test a credential
const testResult = await n8nClient.credentials().test('credential-id');

// Get credential types
const types = await n8nClient.credentials().types();
\`\`\`

### Tags

\`\`\`typescript
// Get all tags
const tags = await n8nClient.tags().all();

// Get a specific tag
const tag = await n8nClient.tags().find('tag-id');

// Create a tag
const newTag = await n8nClient.tags().create({ name: 'Production' });

// Update a tag
await n8nClient.tags().update('tag-id', { name: 'Staging' });

// Delete a tag
await n8nClient.tags().delete('tag-id');

// Get workflows with a tag
const workflows = await n8nClient.tags().workflows('tag-id');
\`\`\`

## Webhook Support

### Setting Up Webhook Handlers

\`\`\`typescript
import { Controller, Post, Body } from '@nestjs/common';
import { N8nWebhook, WebhookService } from 'nestjs-n8n';

@Controller('webhooks')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('n8n')
  @N8nWebhook('my-workflow-id') // Optional: specify workflow ID
  async handleWebhook(@Body() payload: any) {
    const result = await this.webhookService.processWebhook(payload);
    return { success: true, data: result };
  }
}
\`\`\`

### Webhook Validation

\`\`\`typescript
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { N8nWebhook, WebhookValidationGuard } from 'nestjs-n8n';

@Controller('webhooks')
export class WebhookController {
  @Post('n8n')
  @UseGuards(WebhookValidationGuard)
  @N8nWebhook('my-workflow-id')
  async handleWebhook(@Body() payload: any) {
    // Payload is validated by the guard
    return { success: true };
  }
}
\`\`\`

## Swagger/OpenAPI Documentation

This package includes full Swagger/OpenAPI support with pre-configured DTOs and decorators. See [SWAGGER_SETUP.md](./SWAGGER_SETUP.md) for detailed setup instructions.

### Quick Swagger Setup

1. Install Swagger in your application:
\`\`\`bash
npm install @nestjs/swagger
\`\`\`

2. Configure Swagger in `main.ts`:
\`\`\`typescript
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('N8N API')
  .setDescription('API for managing n8n workflows')
  .setVersion('1.0')
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
\`\`\`

3. Use the provided DTOs in your controllers:
\`\`\`typescript
import { CreateWorkflowDto, UpdateWorkflowDto } from 'nestjs-n8n';

@Post()
async createWorkflow(@Body() dto: CreateWorkflowDto) {
  return this.n8nClient.workflows().create(dto);
}
\`\`\`

For complete examples and best practices, see [SWAGGER_SETUP.md](./SWAGGER_SETUP.md).

## Configuration Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `baseUrl` | string | Yes | - | Your n8n instance URL |
| `apiKey` | string | Yes | - | n8n API key |
| `timeout` | number | No | 30000 | Request timeout in milliseconds |

## Environment Variables

\`\`\`env
N8N_BASE_URL=https://your-n8n-instance.com
N8N_API_KEY=your-api-key-here
N8N_TIMEOUT=30000
\`\`\`

## Testing

\`\`\`typescript
import { Test } from '@nestjs/testing';
import { N8nModule, N8nClientService } from 'nestjs-n8n';

describe('WorkflowService', () => {
  let service: WorkflowService;
  let n8nClient: N8nClientService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        N8nModule.forRoot({
          baseUrl: 'http://localhost:5678',
          apiKey: 'test-key',
        }),
      ],
      providers: [WorkflowService],
    }).compile();

    service = module.get<WorkflowService>(WorkflowService);
    n8nClient = module.get<N8nClientService>(N8nClientService);
  });

  it('should get all workflows', async () => {
    const workflows = await service.getAllWorkflows();
    expect(workflows).toBeDefined();
  });
});
\`\`\`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

For issues and questions, please open an issue on [GitHub](https://github.com/ChimfwembeMLF/nestjs-n8n/issues).
