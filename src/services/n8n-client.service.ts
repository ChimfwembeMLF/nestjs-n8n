import { Injectable, Inject } from "@nestjs/common"
import { HttpService } from "@nestjs/axios"
import { firstValueFrom } from "rxjs"
import type { AxiosRequestConfig, AxiosResponse } from "axios"
import type { N8nModuleOptions } from "../interfaces/n8n-module-options.interface"
import { DEFAULT_TIMEOUT, N8N_MODULE_OPTIONS } from "../constants/n8n.constants"
import { N8nConnectionError, N8nAuthenticationError } from "../errors/n8n.errors"
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

  constructor(
    @Inject(N8N_MODULE_OPTIONS) options: N8nModuleOptions,
    httpService: HttpService
  ) {
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
   * Handle HTTP errors with specific error types
   */
  private handleError(error: any): never {
    if (error.response) {
      const status = error.response.status
      const message = error.response.data?.message || error.response.statusText || error.message
      
      if (status === 401) {
        throw new N8nAuthenticationError(this.apiKey)
      }
      
      if (status === 404) {
        throw new Error(`N8N API endpoint not found. Check your baseUrl: ${this.baseUrl}`)
      }
      
      if (status === 403) {
        throw new Error(`Access denied. Check your N8N API key permissions.`)
      }
      
      if (status >= 500) {
        throw new Error(`N8N server error (${status}): ${message}. Check your N8N instance health.`)
      }
      
      throw new Error(`N8N API error (${status}): ${message}`)
    } else if (error.request) {
      throw new N8nConnectionError(this.baseUrl, new Error('No response received from N8N API. Check if N8N is running and accessible.'))
    } else if (error.code === 'ECONNREFUSED') {
      throw new N8nConnectionError(this.baseUrl, new Error('Connection refused. Is N8N running on the specified URL?'))
    } else if (error.code === 'ENOTFOUND') {
      throw new N8nConnectionError(this.baseUrl, new Error('Host not found. Check your baseUrl configuration.'))
    } else {
      throw new Error(`N8N Client Error: ${error.message}`)
    }
  }
}
