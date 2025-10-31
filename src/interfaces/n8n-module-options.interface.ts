import type { ModuleMetadata, Type } from "@nestjs/common"

export interface N8nModuleOptions {
  /**
   * The base URL of your n8n instance
   * @example 'https://n8n.example.com'
   */
  baseUrl: string

  /**
   * API key for authentication
   */
  apiKey: string

  /**
   * Optional timeout for HTTP requests in milliseconds
   * @default 30000
   */
  timeout?: number

  /**
   * Optional custom headers to include in all requests
   */
  headers?: Record<string, string>
}

export interface N8nOptionsFactory {
  createN8nOptions(): Promise<N8nModuleOptions> | N8nModuleOptions
}

export interface N8nModuleAsyncOptions extends Pick<ModuleMetadata, "imports"> {
  useExisting?: Type<N8nOptionsFactory>
  useClass?: Type<N8nOptionsFactory>
  useFactory?: (...args: any[]) => Promise<N8nModuleOptions> | N8nModuleOptions
  inject?: any[]
}
