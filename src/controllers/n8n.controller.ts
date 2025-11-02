import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger'
import { N8nClientService } from '../services/n8n-client.service'
import { CreateWorkflowDto } from '../dto/create-workflow.dto'
import { UpdateWorkflowDto } from '../dto/update-workflow.dto'
import { CreateCredentialDto } from '../dto/create-credential.dto'
import { ExecuteWorkflowDto } from '../dto/execute-workflow.dto'

@ApiTags('N8N Workflows')
@Controller('n8n')
export class N8nController {
  constructor(private readonly n8nClient: N8nClientService) {}

  @Get('workflows')
  @ApiOperation({ summary: 'Get all workflows' })
  @ApiResponse({ status: 200, description: 'List of workflows retrieved successfully' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'cursor', required: false, type: String })
  async getWorkflows(@Query('limit') limit?: number, @Query('cursor') cursor?: string) {
    return this.n8nClient.workflows().list(limit, cursor)
  }

  @Get('workflows/:id')
  @ApiOperation({ summary: 'Get a workflow by ID' })
  @ApiResponse({ status: 200, description: 'Workflow retrieved successfully' })
  @ApiParam({ name: 'id', description: 'Workflow ID' })
  async getWorkflow(@Param('id') id: string) {
    return this.n8nClient.workflows().get(id)
  }

  @Post('workflows')
  @ApiOperation({ summary: 'Create a new workflow' })
  @ApiResponse({ status: 201, description: 'Workflow created successfully' })
  async createWorkflow(@Body() createWorkflowDto: CreateWorkflowDto) {
    return this.n8nClient.workflows().create(createWorkflowDto)
  }

  @Put('workflows/:id')
  @ApiOperation({ summary: 'Update a workflow' })
  @ApiResponse({ status: 200, description: 'Workflow updated successfully' })
  @ApiParam({ name: 'id', description: 'Workflow ID' })
  async updateWorkflow(@Param('id') id: string, @Body() updateWorkflowDto: UpdateWorkflowDto) {
    return this.n8nClient.workflows().update(id, updateWorkflowDto)
  }

  @Delete('workflows/:id')
  @ApiOperation({ summary: 'Delete a workflow' })
  @ApiResponse({ status: 200, description: 'Workflow deleted successfully' })
  @ApiParam({ name: 'id', description: 'Workflow ID' })
  async deleteWorkflow(@Param('id') id: string) {
    return this.n8nClient.workflows().delete(id)
  }

  @Post('workflows/:id/activate')
  @ApiOperation({ summary: 'Activate a workflow' })
  @ApiResponse({ status: 200, description: 'Workflow activated successfully' })
  @ApiParam({ name: 'id', description: 'Workflow ID' })
  async activateWorkflow(@Param('id') id: string) {
    return this.n8nClient.workflows().activate(id)
  }

  @Post('workflows/:id/deactivate')
  @ApiOperation({ summary: 'Deactivate a workflow' })
  @ApiResponse({ status: 200, description: 'Workflow deactivated successfully' })
  @ApiParam({ name: 'id', description: 'Workflow ID' })
  async deactivateWorkflow(@Param('id') id: string) {
    return this.n8nClient.workflows().deactivate(id)
  }

  @Post('workflows/:id/execute')
  @ApiOperation({ summary: 'Execute a workflow manually' })
  @ApiResponse({ status: 200, description: 'Workflow executed successfully' })
  @ApiParam({ name: 'id', description: 'Workflow ID' })
  async executeWorkflow(@Param('id') id: string, @Body() executeDto?: ExecuteWorkflowDto) {
    return this.n8nClient.workflows().execute(id)
  }

  @Get('executions')
  @ApiOperation({ summary: 'Get all executions' })
  @ApiResponse({ status: 200, description: 'List of executions retrieved successfully' })
  async getExecutions() {
    return this.n8nClient.executions().list()
  }

  @Get('executions/:id')
  @ApiOperation({ summary: 'Get an execution by ID' })
  @ApiResponse({ status: 200, description: 'Execution retrieved successfully' })
  @ApiParam({ name: 'id', description: 'Execution ID' })
  async getExecution(@Param('id') id: string) {
    return this.n8nClient.executions().get(id)
  }

  @Delete('executions/:id')
  @ApiOperation({ summary: 'Delete an execution' })
  @ApiResponse({ status: 200, description: 'Execution deleted successfully' })
  @ApiParam({ name: 'id', description: 'Execution ID' })
  async deleteExecution(@Param('id') id: string) {
    return this.n8nClient.executions().delete(id)
  }

  @Get('credentials')
  @ApiOperation({ summary: 'Get all credentials' })
  @ApiResponse({ status: 200, description: 'List of credentials retrieved successfully' })
  async getCredentials() {
    return this.n8nClient.credentials().list()
  }

  @Post('credentials')
  @ApiOperation({ summary: 'Create a new credential' })
  @ApiResponse({ status: 201, description: 'Credential created successfully' })
  async createCredential(@Body() createCredentialDto: CreateCredentialDto) {
    return this.n8nClient.credentials().create(createCredentialDto)
  }

  @Get('credentials/:id')
  @ApiOperation({ summary: 'Get a credential by ID' })
  @ApiResponse({ status: 200, description: 'Credential retrieved successfully' })
  @ApiParam({ name: 'id', description: 'Credential ID' })
  async getCredential(@Param('id') id: string) {
    return this.n8nClient.credentials().get(id)
  }

  @Delete('credentials/:id')
  @ApiOperation({ summary: 'Delete a credential' })
  @ApiResponse({ status: 200, description: 'Credential deleted successfully' })
  @ApiParam({ name: 'id', description: 'Credential ID' })
  async deleteCredential(@Param('id') id: string) {
    return this.n8nClient.credentials().delete(id)
  }

  @Get('tags')
  @ApiOperation({ summary: 'Get all tags' })
  @ApiResponse({ status: 200, description: 'List of tags retrieved successfully' })
  async getTags() {
    return this.n8nClient.tags().list()
  }
}