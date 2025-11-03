import type { N8nModuleOptions } from "../interfaces/n8n-module-options.interface"

/**
 * Helper function to create N8N configuration with proper typing
 * This helps prevent common typos like baseURL vs baseUrl
 */
export function createN8nConfig(config: N8nModuleOptions): N8nModuleOptions {
  return config
}

/**
 * Type guard to validate N8N configuration at runtime
 */
export function isValidN8nConfig(config: any): config is N8nModuleOptions {
  return (
    typeof config === 'object' &&
    config !== null &&
    typeof config.baseUrl === 'string' &&
    typeof config.apiKey === 'string' &&
    (config.timeout === undefined || typeof config.timeout === 'number') &&
    (config.headers === undefined || typeof config.headers === 'object') &&
    (config.enableSwaggerController === undefined || typeof config.enableSwaggerController === 'boolean') &&
    (config.validateConnection === undefined || typeof config.validateConnection === 'boolean')
  )
}