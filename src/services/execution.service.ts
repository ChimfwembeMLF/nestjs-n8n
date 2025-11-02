import type { N8nClientService } from "./n8n-client.service"
import type {
  Execution,
  ExecutionListResponse,
  ExecutionListOptions,
  DeleteExecutionResponse,
} from "../interfaces/execution.interface"

export class ExecutionService {
  constructor(private readonly client: N8nClientService) {}

  /**
   * Get all executions with optional filters
   */
  async list(options?: ExecutionListOptions): Promise<ExecutionListResponse> {
    const params = new URLSearchParams()

    if (options?.limit) params.append("limit", options.limit.toString())
    if (options?.cursor) params.append("cursor", options.cursor)
    if (options?.workflowId) params.append("workflowId", options.workflowId)
    if (options?.status) params.append("status", options.status)
    if (options?.includeData !== undefined) {
      params.append("includeData", options.includeData.toString())
    }

    const query = params.toString() ? `?${params.toString()}` : ""
    return this.client.get<ExecutionListResponse>(`/api/v1/executions${query}`)
  }

  /**
   * Get executions for a specific workflow
   */
  async forWorkflow(workflowId: string, options?: Omit<ExecutionListOptions, 'workflowId'>): Promise<ExecutionListResponse> {
    return this.list({ ...options, workflowId })
  }

  /**
   * Get a specific execution by ID
   */
  async get(id: string, includeData = false): Promise<Execution> {
    const query = includeData ? "?includeData=true" : ""
    return this.client.get<Execution>(`/api/v1/executions/${id}${query}`)
  }

  /**
   * Delete an execution
   */
  async delete(id: string): Promise<DeleteExecutionResponse> {
    return this.client.delete<DeleteExecutionResponse>(`/api/v1/executions/${id}`)
  }

  /**
   * Retry a failed execution
   */
  async retry(id: string): Promise<Execution> {
    return this.client.post<Execution>(`/api/v1/executions/${id}/retry`)
  }

  /**
   * Stop a running execution
   */
  async stop(id: string): Promise<Execution> {
    return this.client.post<Execution>(`/api/v1/executions/${id}/stop`)
  }
}
