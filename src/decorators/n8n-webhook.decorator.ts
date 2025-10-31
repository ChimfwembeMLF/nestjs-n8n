import { SetMetadata } from "@nestjs/common"

export const N8N_WEBHOOK_METADATA = "n8n:webhook"

export interface N8nWebhookOptions {
  /**
   * The path segment for this webhook (will be appended to base webhook path)
   */
  path: string

  /**
   * Optional workflow ID to validate against
   */
  workflowId?: string

  /**
   * Whether to validate the webhook signature
   */
  validateSignature?: boolean
}

/**
 * Decorator to mark a method as an n8n webhook handler
 */
export const N8nWebhook = (options: N8nWebhookOptions): MethodDecorator => {
  return SetMetadata(N8N_WEBHOOK_METADATA, options)
}
