import { Injectable } from "@nestjs/common"
import type { N8nClientService } from "./n8n-client.service"
import type { WebhookPayload, WebhookValidationResult } from "../interfaces/webhook.interface"

@Injectable()
export class WebhookService {
  constructor(private readonly client: N8nClientService) {}

  /**
   * Validate a webhook payload
   */
  async validate(payload: WebhookPayload, expectedWorkflowId?: string): Promise<WebhookValidationResult> {
    try {
      // Basic validation
      if (!payload.data) {
        return {
          valid: false,
          error: "Missing webhook data",
        }
      }

      // Validate workflow ID if provided
      if (expectedWorkflowId && payload.workflowId !== expectedWorkflowId) {
        return {
          valid: false,
          error: "Workflow ID mismatch",
        }
      }

      return {
        valid: true,
        workflowId: payload.workflowId,
      }
    } catch (error: any) {
      return {
        valid: false,
        error: error.message,
      }
    }
  }

  /**
   * Process a webhook payload
   */
  async process(payload: WebhookPayload): Promise<any> {
    // This is a placeholder for custom webhook processing logic
    // Users can extend this or implement their own processing
    return payload.data
  }

  /**
   * Get webhook URL for a workflow
   */
  getWebhookUrl(workflowId: string, webhookPath: string): string {
    // Construct the webhook URL based on n8n instance
    const baseUrl = (this.client as any).baseUrl
    return `${baseUrl}/webhook/${webhookPath}`
  }

  /**
   * Test a webhook
   */
  async test(workflowId: string, testData: any): Promise<any> {
    return this.client.post(`/api/v1/workflows/${workflowId}/test-webhook`, testData)
  }
}
