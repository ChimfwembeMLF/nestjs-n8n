export interface Execution {
  id: string
  finished: boolean
  mode: string
  retryOf?: string
  retrySuccessId?: string
  startedAt: string
  stoppedAt?: string
  workflowId: string
  workflowData?: any
  data?: ExecutionData
  status: ExecutionStatus
}

export interface ExecutionData {
  resultData: {
    runData: Record<string, any>
    lastNodeExecuted?: string
    error?: any
  }
  executionData?: {
    contextData: Record<string, any>
    nodeExecutionStack: any[]
    waitingExecution: Record<string, any>
  }
}

export type ExecutionStatus = "success" | "error" | "waiting" | "running" | "canceled" | "crashed" | "new" | "unknown"

export interface ExecutionListResponse {
  data: Execution[]
  nextCursor?: string
}

export interface ExecutionListOptions {
  limit?: number
  cursor?: string
  workflowId?: string
  status?: ExecutionStatus
  includeData?: boolean
}

export interface DeleteExecutionResponse {
  success: boolean
}
