import type { N8nClientService } from "./n8n-client.service"
import type {
  Workflow,
  WorkflowListResponse,
} from "../interfaces/workflow.interface"
import type { CreateWorkflowDto } from "../dto/create-workflow.dto"
import type { UpdateWorkflowDto } from "../dto/update-workflow.dto"

export class WorkflowService {
  constructor(private readonly client: N8nClientService) {}

  /**
   * Get all workflows
   */
  async list(limit?: number, cursor?: string): Promise<WorkflowListResponse> {
    const params = new URLSearchParams()
    if (limit) params.append("limit", limit.toString())
    if (cursor) params.append("cursor", cursor)

    const query = params.toString() ? `?${params.toString()}` : ""
    return this.client.get<WorkflowListResponse>(`/api/v1/workflows${query}`)
  }

  /**
   * Get a specific workflow by ID
   */
  async get(id: string): Promise<Workflow> {
    return this.client.get<Workflow>(`/api/v1/workflows/${id}`)
  }

  /**
   * Create a new workflow
   */
  async create(data: CreateWorkflowDto): Promise<Workflow> {
    return this.client.post<Workflow>("/api/v1/workflows", data)
  }

  /**
   * Update an existing workflow
   */
  async update(id: string, data: UpdateWorkflowDto): Promise<Workflow> {
    return this.client.patch<Workflow>(`/api/v1/workflows/${id}`, data)
  }

  /**
   * Delete a workflow
   */
  async delete(id: string): Promise<void> {
    return this.client.delete(`/api/v1/workflows/${id}`)
  }

  /**
   * Activate a workflow
   */
  async activate(id: string): Promise<Workflow> {
    return this.client.patch<Workflow>(`/api/v1/workflows/${id}`, { active: true })
  }

  /**
   * Deactivate a workflow
   */
  async deactivate(id: string): Promise<Workflow> {
    return this.client.patch<Workflow>(`/api/v1/workflows/${id}`, { active: false })
  }

  /**
   * Get workflow tags
   */
  async tags(id: string): Promise<any> {
    const workflow = await this.get(id)
    return workflow.tags || []
  }

  /**
   * Execute a workflow manually
   */
  async execute(id: string): Promise<any> {
    return this.client.post(`/api/v1/workflows/${id}/execute`)
  }
}
