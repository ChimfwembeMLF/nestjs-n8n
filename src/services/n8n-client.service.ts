import { Injectable } from "@nestjs/common"
import type { HttpService } from "@nestjs/axios"
import { firstValueFrom } from "rxjs"
import type { AxiosRequestConfig, AxiosResponse } from "axios"
import type { N8nModuleOptions } from "../interfaces/n8n-module-options.interface"
import { DEFAULT_TIMEOUT } from "../constants/n8n.constants"
import { WorkflowService } from "./workflow.service"
import { ExecutionService } from "./execution.service"
import { CredentialService } from "./credential.service"
import { TagService } from "./tag.service"
import { WebhookService } from "./webhook.service"

@Injectable()
export class N8nClientService {
  private readonly baseUrl: string
  private readonly apiKey: string
  private readonly timeout: number
  private readonly customHeaders: Record<string, string>
  private readonly options: N8nModuleOptions
  private readonly httpService: HttpService

  constructor(options: N8nModuleOptions, httpService: HttpService) {
    this.options = options
    this.httpService = httpService
    this.baseUrl = options.baseUrl.replace(/\/$/, "")
    this.apiKey = options.apiKey
    this.timeout = options.timeout || DEFAULT_TIMEOUT
    this.customHeaders = options.headers || {}
  }

  /**
   * Access workflow-related operations
   */
  workflows(): WorkflowService {
    return new WorkflowService(this)
  }

  /**
   * Access execution-related operations
   */
  executions(): ExecutionService {
    return new ExecutionService(this)
  }

  /**
   * Access credential-related operations
   */
  credentials(): CredentialService {
    return new CredentialService(this)
  }

  /**
   * Access tag-related operations
   */
  tags(): TagService {
    return new TagService(this)
  }

  /**
   * Access webhook-related operations
   */
  webhooks(): WebhookService {
    return new WebhookService(this)
  }

  /**
   * Make a GET request to the n8n API
   */
  async get<T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.request<T>("GET", endpoint, undefined, config)
    return response.data
  }

  /**
   * Make a POST request to the n8n API
   */
  async post<T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.request<T>("POST", endpoint, data, config)
    return response.data
  }

  /**
   * Make a PUT request to the n8n API
   */
  async put<T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.request<T>("PUT", endpoint, data, config)
    return response.data
  }

  /**
   * Make a PATCH request to the n8n API
   */
  async patch<T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.request<T>("PATCH", endpoint, data, config)
    return response.data
  }

  /**
   * Make a DELETE request to the n8n API
   */
  async delete<T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.request<T>("DELETE", endpoint, undefined, config)
    return response.data
  }

  /**
   * Make a generic HTTP request to the n8n API
   */
  private async request<T = any>(
    method: string,
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`

    const requestConfig: AxiosRequestConfig = {
      method,
      url,
      data,
      timeout: this.timeout,
      headers: {
        "X-N8N-API-KEY": this.apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
        ...this.customHeaders,
        ...(config?.headers || {}),
      },
      ...config,
    }

    try {
      return await firstValueFrom(this.httpService.request<T>(requestConfig))
    } catch (error: any) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: any): void {
    if (error.response) {
      const status = error.response.status
      const message = error.response.data?.message || error.message

      console.error(`[N8N Client] HTTP ${status}: ${message}`)
    } else if (error.request) {
      console.error("[N8N Client] No response received from n8n API")
    } else {
      console.error(`[N8N Client] Error: ${error.message}`)
    }
  }
}
