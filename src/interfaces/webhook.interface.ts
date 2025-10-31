export interface WebhookPayload {
  workflowId?: string
  executionId?: string
  data: any
  headers: Record<string, string>
  query: Record<string, string>
  method: string
}

export interface WebhookResponse {
  success: boolean
  data?: any
  error?: string
}

export interface WebhookValidationResult {
  valid: boolean
  workflowId?: string
  error?: string
}
