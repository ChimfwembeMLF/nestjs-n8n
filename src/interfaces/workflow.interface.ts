export interface Workflow {
  id: string
  name: string
  active: boolean
  createdAt: string
  updatedAt: string
  nodes: WorkflowNode[]
  connections: Record<string, any>
  settings?: WorkflowSettings
  staticData?: any
  tags?: Tag[]
  versionId?: string
}

export interface WorkflowNode {
  id: string
  name: string
  type: string
  typeVersion: number
  position: [number, number]
  parameters: Record<string, any>
  credentials?: Record<string, any>
}

export interface WorkflowSettings {
  saveDataErrorExecution?: string
  saveDataSuccessExecution?: string
  saveManualExecutions?: boolean
  callerPolicy?: string
  executionTimeout?: number
  timezone?: string
}

export interface Tag {
  id: string
  name: string
  createdAt?: string
  updatedAt?: string
}

export interface WorkflowListResponse {
  data: Workflow[]
  nextCursor?: string
}
