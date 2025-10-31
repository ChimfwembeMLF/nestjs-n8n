import { Injectable, type CanActivate, type ExecutionContext } from "@nestjs/common"
import type { Reflector } from "@nestjs/core"
import { N8N_WEBHOOK_METADATA, type N8nWebhookOptions } from "../decorators/n8n-webhook.decorator"

@Injectable()
export class WebhookValidationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const webhookOptions = this.reflector.get<N8nWebhookOptions>(N8N_WEBHOOK_METADATA, context.getHandler())

    if (!webhookOptions) {
      return true
    }

    const request = context.switchToHttp().getRequest()

    // Validate webhook signature if required
    if (webhookOptions.validateSignature) {
      const signature = request.headers["x-n8n-signature"]
      if (!signature) {
        return false
      }
      // Add signature validation logic here
    }

    // Validate workflow ID if specified
    if (webhookOptions.workflowId) {
      const workflowId = request.body?.workflowId || request.query?.workflowId
      if (workflowId !== webhookOptions.workflowId) {
        return false
      }
    }

    return true
  }
}
