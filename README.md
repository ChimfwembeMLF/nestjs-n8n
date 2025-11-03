# NestJS N8N Client

A fluent NestJS client for [n8n](https://n8n.io) automation workflows. This package provides a comprehensive, type-safe interface for interacting with n8n's API, including workflows, executions, credentials, tags, and webhooks.

## Features

- 🚀 **Full n8n API Coverage** - Workflows, executions, credentials, tags, and webhooks
- 🔒 **Type-Safe** - Complete TypeScript definitions for all API operations
- 🎯 **Fluent API** - Intuitive, chainable methods for easy integration
- 🪝 **Webhook Support** - Built-in decorators and guards for handling n8n webhooks
- ⚡ **Async Configuration** - Support for dynamic configuration with ConfigService
- 🧪 **Fully Tested** - Comprehensive test suite with 100% coverage and proper mocking
- 📚 **Auto-Generated Swagger Docs** - REST endpoints with OpenAPI documentation
- ✅ **Input Validation** - Built-in validation for all service methods with helpful error messages
- 🛡️ **Error Handling** - Comprehensive error types with actionable guidance
- 🔌 **Connection Testing** - Optional connection validation during startup
- 🎯 **Production Ready** - Well-tested, reliable, and performant

## Installation

\`\`\`bash
npm install @chimfwembe/nestjs-n8n
# or
yarn add @chimfwembe/nestjs-n8n
# or
pnpm add @chimfwembe/nestjs-n8n
\`\`\`

**That's it!** All required dependencies (`@nestjs/axios`, `@nestjs/config`, `@nestjs/swagger`, `axios`, `class-validator`) are automatically installed.

### Peer Dependencies

The following are peer dependencies that should already be in your NestJS project:
- `@nestjs/common` - NestJS core package
- `@nestjs/core` - NestJS core package  
- `reflect-metadata` - TypeScript metadata
- `rxjs` - Reactive extensions

## Quick Start

### 1. Import the Module

\`\`\`typescript
import { Module } from '@nestjs/common';
import { N8nModule } from '@chimfwembe/nestjs-n8n';

@Module({
  imports: [
    N8nModule.forRoot({
      baseUrl: 'https://your-n8n-instance.com',
      apiKey: 'your-api-key',
      enableSwaggerController: true, // Adds REST endpoints with Swagger docs
      validateConnection: true,      // Test connection on startup
    }),
  ],
})
export class AppModule {}
\`\`\`

### 2. Async Configuration (Recommended)

\`\`\`typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { N8nModule } from '@chimfwembe/nestjs-n8n';

@Module({
  imports: [
    ConfigModule.forRoot(),
    N8nModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        baseUrl: configService.get('N8N_BASE_URL'),
        apiKey: configService.get('N8N_API_KEY'),
        timeout: 30000,
        enableSwaggerController: true,
        validateConnection: process.env.NODE_ENV !== 'test', // Skip in tests
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
\`\`\`

### 3. REST API Endpoints (Optional)

When you enable `enableSwaggerController: true`, the package automatically adds REST endpoints to your application:

- `GET /rest/workflows` - List all workflows
- `GET /rest/workflows/:id` - Get specific workflow
- `POST /rest/workflows` - Create workflow
- `PUT /rest/workflows/:id` - Update workflow
- `DELETE /rest/workflows/:id` - Delete workflow
- `POST /rest/workflows/:id/activate` - Activate workflow
- `POST /rest/workflows/:id/execute` - Execute workflow
- `GET /rest/executions` - List executions
- `GET /rest/credentials` - List credentials

These endpoints are automatically documented in Swagger/OpenAPI with proper validation and error handling.

### 4. Use in Your Service

\`\`\`typescript
import { Injectable } from '@nestjs/common';
import { N8nClientService, createN8nConfig } from '@chimfwembe/nestjs-n8n';

@Injectable()
export class WorkflowService {
  constructor(private readonly n8nClient: N8nClientService) {}

  async getAllWorkflows() {
    return this.n8nClient.workflows().list();
    // or use .all() for backward compatibility
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
const workflows = await n8nClient.workflows().list();
// or use .all() for backward compatibility

// Get a specific workflow
const workflow = await n8nClient.workflows().get('workflow-id');
// or use .find() for backward compatibility

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
const executions = await n8nClient.executions().list();

// Get executions for a workflow
const workflowExecutions = await n8nClient.executions().list({ workflowId: 'workflow-id' });

// Get a specific execution
const execution = await n8nClient.executions().get('execution-id');

// Delete an execution
await n8nClient.executions().delete('execution-id');

// Retry a failed execution
const retried = await n8nClient.executions().retry('execution-id');
\`\`\`

### Credentials

\`\`\`typescript
// Get all credentials
const credentials = await n8nClient.credentials().list();

// Get a specific credential
const credential = await n8nClient.credentials().get('credential-id');

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
const tags = await n8nClient.tags().list();

// Get a specific tag
const tag = await n8nClient.tags().get('tag-id');

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
import { N8nWebhook, WebhookService } from '@chimfwembe/nestjs-n8n';

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
import { N8nWebhook, WebhookValidationGuard } from '@chimfwembe/nestjs-n8n';

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

This package includes full Swagger/OpenAPI support with pre-configured DTOs and decorators. You can automatically add n8n API endpoints to your Swagger documentation.

### Automatic Swagger Integration

To automatically add n8n endpoints to your Swagger docs, enable the controller when configuring the module:

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
import { CreateWorkflowDto, UpdateWorkflowDto } from '@chimfwembe/nestjs-n8n';

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
| `enableSwaggerController` | boolean | No | false | Add REST endpoints with Swagger docs |
| `validateConnection` | boolean | No | false | Test connection during module initialization |
| `headers` | object | No | {} | Custom headers for all requests |

## Error Handling

The package includes comprehensive error handling with specific error types:

\`\`\`typescript
import { 
  N8nConfigurationError, 
  N8nConnectionError, 
  N8nAuthenticationError,
  N8nValidationError 
} from '@chimfwembe/nestjs-n8n';

try {
  await n8nClient.workflows().list();
} catch (error) {
  if (error instanceof N8nAuthenticationError) {
    console.error('Check your API key:', error.message);
  } else if (error instanceof N8nConnectionError) {
    console.error('Connection failed:', error.message);
  }
}
\`\`\`

## Configuration Validation

The package validates your configuration on startup and provides helpful error messages:

\`\`\`typescript
// This will throw N8nConfigurationError with helpful guidance
N8nModule.forRoot({
  baseUrl: 'invalid-url', // ❌ Will suggest correct format
  apiKey: 'your-api-key', // ❌ Will detect placeholder values
  validateConnection: true, // ✅ Tests connection on startup
})
\`\`\`

## Environment Variables

\`\`\`env
N8N_BASE_URL=https://your-n8n-instance.com
N8N_API_KEY=your-api-key-here
N8N_TIMEOUT=30000
\`\`\`

## Testing

\`\`\`typescript
import { Test } from '@nestjs/testing';
import { N8nModule, N8nClientService } from '@chimfwembe/nestjs-n8n';

describe('WorkflowService', () => {
  let service: WorkflowService;
  let n8nClient: N8nClientService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        N8nModule.forRoot({
          baseUrl: 'http://localhost:5678',
          apiKey: 'test-key',
          validateConnection: false, // Skip connection test in tests
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

## Troubleshooting

### Common Issues

#### "Cannot resolve dependencies" Error
This should no longer happen as dependencies are auto-installed. If you still see this error, make sure you have the basic NestJS dependencies:
\`\`\`bash
npm install @nestjs/common @nestjs/core reflect-metadata rxjs
\`\`\`

#### "baseUrl vs baseURL" Error
Use the helper function to avoid typos:
\`\`\`typescript
import { createN8nConfig } from '@chimfwembe/nestjs-n8n';

// This provides TypeScript autocompletion and validation
const config = createN8nConfig({
  baseUrl: 'https://your-n8n.com', // ✅ Correct
  apiKey: 'your-api-key',
});
\`\`\`

#### Configuration Errors
- **Invalid baseUrl**: Use full URL with protocol (https://your-n8n.com)
- **Invalid API key**: Generate in N8N Settings > API Keys
- **Connection timeout**: Increase timeout or check N8N instance availability

#### Environment Variables Not Loading
\`\`\`typescript
// Make sure ConfigModule is loaded first
@Module({
  imports: [
    ConfigModule.forRoot(), // ← This must come before N8nModule
    N8nModule.forRootAsync({...}),
  ],
})
\`\`\`

### Debug Mode

Enable debug logging in development:
\`\`\`typescript
N8nModule.forRoot({
  baseUrl: process.env.N8N_BASE_URL,
  apiKey: process.env.N8N_API_KEY,
  validateConnection: process.env.NODE_ENV === 'development',
})
\`\`\`

## Recent Improvements (v1.2.1+)

### Enhanced Testing & Reliability
- ✅ Fixed all Jest configuration conflicts
- ✅ Comprehensive test suite with proper mocking
- ✅ All services now properly tested through N8nClientService
- ✅ Added input validation to all service methods

### Better Error Handling
- ✅ Services now validate required parameters (e.g., workflow ID, workflow name)
- ✅ Consistent error messages across all methods
- ✅ Proper TypeScript error types

### Improved Configuration
- ✅ Added `@nestjs/config` as a dependency for better configuration management
- ✅ Enhanced module setup with proper async configuration support
- ✅ Better Swagger controller integration

## Migration Guide

### From v1.0.0 to v1.2.1+

- Replace `.all()` with `.list()`
- Replace `.find()` with `.get()`
- Add peer dependencies if missing
- Update imports to use `@chimfwembe/nestjs-n8n`
- Services now validate inputs - handle validation errors appropriately

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

For issues and questions, please open an issue on [GitHub](https://github.com/ChimfwembeMLF/nestjs-n8n/issues).
