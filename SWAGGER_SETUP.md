# Swagger/OpenAPI Setup Guide

This guide explains how to set up Swagger/OpenAPI documentation for your NestJS application using the `@your-org/nestjs-n8n` package.

## Installation

First, install the required Swagger dependencies in your NestJS application:

\`\`\`bash
npm install @nestjs/swagger
\`\`\`

## Basic Setup

### 1. Configure Swagger in Your Main Application File

Update your `main.ts` file to include Swagger configuration:

\`\`\`typescript
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('N8N API')
    .setDescription('API for managing n8n workflows and automations')
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', name: 'X-N8N-API-KEY', in: 'header' }, 'api-key')
    .addTag('workflows', 'Workflow management endpoints')
    .addTag('executions', 'Execution management endpoints')
    .addTag('credentials', 'Credential management endpoints')
    .addTag('webhooks', 'Webhook endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log('Swagger documentation available at http://localhost:3000/api');
}
bootstrap();
\`\`\`

### 2. Create a Controller with Swagger Decorators

Here's an example controller that uses the n8n client with full Swagger documentation:

\`\`\`typescript
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiSecurity } from '@nestjs/swagger';
import { 
  N8nClientService, 
  CreateWorkflowDto, 
  UpdateWorkflowDto, 
  ExecuteWorkflowDto 
} from '@your-org/nestjs-n8n';

@ApiTags('workflows')
@ApiSecurity('api-key')
@Controller('workflows')
export class WorkflowController {
  constructor(private readonly n8nClient: N8nClientService) {}

  @Get()
  @ApiOperation({ summary: 'Get all workflows', description: 'Retrieve a list of all workflows from n8n' })
  @ApiResponse({ status: 200, description: 'List of workflows retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAllWorkflows() {
    return this.n8nClient.workflows().all();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get workflow by ID' })
  @ApiParam({ name: 'id', description: 'Workflow ID' })
  @ApiResponse({ status: 200, description: 'Workflow found' })
  @ApiResponse({ status: 404, description: 'Workflow not found' })
  async getWorkflow(@Param('id') id: string) {
    return this.n8nClient.workflows().find(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new workflow' })
  @ApiBody({ type: CreateWorkflowDto })
  @ApiResponse({ status: 201, description: 'Workflow created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async createWorkflow(@Body() createWorkflowDto: CreateWorkflowDto) {
    return this.n8nClient.workflows().create(createWorkflowDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a workflow' })
  @ApiParam({ name: 'id', description: 'Workflow ID' })
  @ApiBody({ type: UpdateWorkflowDto })
  @ApiResponse({ status: 200, description: 'Workflow updated successfully' })
  @ApiResponse({ status: 404, description: 'Workflow not found' })
  async updateWorkflow(
    @Param('id') id: string,
    @Body() updateWorkflowDto: UpdateWorkflowDto,
  ) {
    return this.n8nClient.workflows().update(id, updateWorkflowDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a workflow' })
  @ApiParam({ name: 'id', description: 'Workflow ID' })
  @ApiResponse({ status: 200, description: 'Workflow deleted successfully' })
  @ApiResponse({ status: 404, description: 'Workflow not found' })
  async deleteWorkflow(@Param('id') id: string) {
    return this.n8nClient.workflows().delete(id);
  }

  @Post(':id/activate')
  @ApiOperation({ summary: 'Activate a workflow' })
  @ApiParam({ name: 'id', description: 'Workflow ID' })
  @ApiResponse({ status: 200, description: 'Workflow activated successfully' })
  async activateWorkflow(@Param('id') id: string) {
    return this.n8nClient.workflows().activate(id);
  }

  @Post(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate a workflow' })
  @ApiParam({ name: 'id', description: 'Workflow ID' })
  @ApiResponse({ status: 200, description: 'Workflow deactivated successfully' })
  async deactivateWorkflow(@Param('id') id: string) {
    return this.n8nClient.workflows().deactivate(id);
  }

  @Post(':id/execute')
  @ApiOperation({ summary: 'Execute a workflow' })
  @ApiParam({ name: 'id', description: 'Workflow ID' })
  @ApiBody({ type: ExecuteWorkflowDto })
  @ApiResponse({ status: 200, description: 'Workflow executed successfully' })
  async executeWorkflow(
    @Param('id') id: string,
    @Body() executeDto: ExecuteWorkflowDto,
  ) {
    return this.n8nClient.workflows().execute(id, executeDto.data);
  }
}
\`\`\`

### 3. Webhook Controller Example

\`\`\`typescript
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { N8nWebhook, WebhookService, WebhookValidationGuard } from '@your-org/nestjs-n8n';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('n8n')
  @UseGuards(WebhookValidationGuard)
  @N8nWebhook()
  @ApiOperation({ 
    summary: 'Handle n8n webhook', 
    description: 'Endpoint to receive webhook calls from n8n workflows' 
  })
  @ApiBody({ 
    description: 'Webhook payload from n8n',
    schema: {
      type: 'object',
      properties: {
        workflowId: { type: 'string' },
        executionId: { type: 'string' },
        data: { type: 'object' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid webhook payload' })
  async handleWebhook(@Body() payload: any) {
    const result = await this.webhookService.processWebhook(payload);
    return { success: true, data: result };
  }
}
\`\`\`

### 4. Credentials Controller Example

\`\`\`typescript
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiSecurity } from '@nestjs/swagger';
import { N8nClientService, CreateCredentialDto } from '@your-org/nestjs-n8n';

@ApiTags('credentials')
@ApiSecurity('api-key')
@Controller('credentials')
export class CredentialController {
  constructor(private readonly n8nClient: N8nClientService) {}

  @Get()
  @ApiOperation({ summary: 'Get all credentials' })
  @ApiResponse({ status: 200, description: 'List of credentials' })
  async getAllCredentials() {
    return this.n8nClient.credentials().all();
  }

  @Get('types')
  @ApiOperation({ summary: 'Get available credential types' })
  @ApiResponse({ status: 200, description: 'List of credential types' })
  async getCredentialTypes() {
    return this.n8nClient.credentials().types();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new credential' })
  @ApiBody({ type: CreateCredentialDto })
  @ApiResponse({ status: 201, description: 'Credential created' })
  async createCredential(@Body() createDto: CreateCredentialDto) {
    return this.n8nClient.credentials().create(createDto);
  }

  @Post(':id/test')
  @ApiOperation({ summary: 'Test a credential' })
  @ApiParam({ name: 'id', description: 'Credential ID' })
  @ApiResponse({ status: 200, description: 'Credential test result' })
  async testCredential(@Param('id') id: string) {
    return this.n8nClient.credentials().test(id);
  }
}
\`\`\`

## Available DTOs

The package exports the following DTOs with Swagger decorators:

- `CreateWorkflowDto` - For creating workflows
- `UpdateWorkflowDto` - For updating workflows
- `ExecuteWorkflowDto` - For executing workflows
- `CreateCredentialDto` - For creating credentials

All DTOs include:
- `@ApiProperty()` decorators for required fields
- `@ApiPropertyOptional()` decorators for optional fields
- Class-validator decorators for validation
- TypeScript types for type safety

## Customizing Swagger UI

### Add Authentication

\`\`\`typescript
const config = new DocumentBuilder()
  .setTitle('N8N API')
  .setDescription('API documentation')
  .setVersion('1.0')
  .addBearerAuth()
  .addApiKey({ type: 'apiKey', name: 'X-API-KEY', in: 'header' })
  .build();
\`\`\`

### Add Multiple Tags

\`\`\`typescript
const config = new DocumentBuilder()
  .addTag('workflows', 'Workflow operations')
  .addTag('executions', 'Execution operations')
  .addTag('credentials', 'Credential operations')
  .addTag('tags', 'Tag operations')
  .addTag('webhooks', 'Webhook operations')
  .build();
\`\`\`

### Custom Swagger Options

\`\`\`typescript
SwaggerModule.setup('api', app, document, {
  swaggerOptions: {
    persistAuthorization: true,
    docExpansion: 'none',
    filter: true,
    showRequestDuration: true,
  },
});
\`\`\`

## Accessing Swagger Documentation

After starting your application, visit:

\`\`\`
http://localhost:3000/api
\`\`\`

You'll see an interactive API documentation interface where you can:
- View all available endpoints
- Test API calls directly from the browser
- See request/response schemas
- Authenticate and make authorized requests

## Best Practices

1. **Use DTOs**: Always use the provided DTOs for request bodies to get automatic validation and documentation
2. **Add Descriptions**: Use the `description` property in decorators to provide helpful context
3. **Document Responses**: Use `@ApiResponse()` for all possible response codes
4. **Group Endpoints**: Use `@ApiTags()` to organize related endpoints
5. **Secure Endpoints**: Use `@ApiSecurity()` to document authentication requirements

## Troubleshooting

### Swagger UI Not Loading

Make sure you've installed `@nestjs/swagger`:
\`\`\`bash
npm install @nestjs/swagger
\`\`\`

### DTOs Not Showing in Swagger

Ensure you're importing DTOs from the package:
\`\`\`typescript
import { CreateWorkflowDto } from '@your-org/nestjs-n8n';
\`\`\`

### Missing Decorators

The package marks `@nestjs/swagger` as an optional peer dependency. Install it in your application to use Swagger features.

## Example Project Structure

\`\`\`
src/
├── main.ts                 # Swagger setup
├── app.module.ts          # N8N module import
├── controllers/
│   ├── workflow.controller.ts
│   ├── execution.controller.ts
│   ├── credential.controller.ts
│   └── webhook.controller.ts
└── services/
    └── automation.service.ts
\`\`\`

## Additional Resources

- [NestJS Swagger Documentation](https://docs.nestjs.com/openapi/introduction)
- [OpenAPI Specification](https://swagger.io/specification/)
- [n8n API Documentation](https://docs.n8n.io/api/)
