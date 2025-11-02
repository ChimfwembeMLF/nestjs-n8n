import type { N8nModuleOptions } from "../interfaces/n8n-module-options.interface"
import { N8nConfigurationError, N8nConnectionError } from "../errors/n8n.errors"

/**
 * Validates N8N module configuration
 */
export async function validateN8nConfiguration(options: N8nModuleOptions): Promise<void> {
  // Validate required fields
  if (!options.baseUrl) {
    throw new N8nConfigurationError('baseUrl is required. Please provide your N8N instance URL.', 'baseUrl')
  }

  if (!options.apiKey) {
    throw new N8nConfigurationError('apiKey is required. Please provide a valid N8N API key.', 'apiKey')
  }

  // Validate baseUrl format
  try {
    const url = new URL(options.baseUrl)
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new N8nConfigurationError('baseUrl must use http:// or https:// protocol', 'baseUrl')
    }
  } catch (error) {
    throw new N8nConfigurationError(`Invalid baseUrl format: ${options.baseUrl}`, 'baseUrl')
  }

  // Validate API key format (basic check)
  if (options.apiKey.length < 10) {
    throw new N8nConfigurationError('API key appears to be too short. Please check your N8N API key.', 'apiKey')
  }

  // Check for common placeholder values
  const placeholders = ['your-api-key', 'api-key-here', 'YOUR_API_KEY', 'replace-me']
  if (placeholders.some(placeholder => options.apiKey.includes(placeholder))) {
    throw new N8nConfigurationError('API key appears to be a placeholder. Please provide your actual N8N API key.', 'apiKey')
  }

  // Validate timeout
  if (options.timeout && (options.timeout < 1000 || options.timeout > 300000)) {
    throw new N8nConfigurationError('timeout must be between 1000ms (1s) and 300000ms (5m)', 'timeout')
  }

  // Test connection if requested
  if (options.validateConnection) {
    await testN8nConnection(options)
  }
}

/**
 * Tests connection to N8N instance
 */
async function testN8nConnection(options: N8nModuleOptions): Promise<void> {
  try {
    const response = await fetch(`${options.baseUrl}/api/v1/workflows?limit=1`, {
      method: 'GET',
      headers: {
        'X-N8N-API-KEY': options.apiKey,
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(options.timeout || 10000),
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid API key')
      }
      if (response.status === 404) {
        throw new Error('N8N API not found - check your baseUrl')
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new N8nConnectionError(options.baseUrl, new Error('Connection timeout'))
    }
    throw new N8nConnectionError(options.baseUrl, error)
  }
}

/**
 * Helper function to provide configuration troubleshooting tips
 */
export function getConfigurationHelp(error: N8nConfigurationError): string {
  const tips: Record<string, string> = {
    baseUrl: `
Tips for baseUrl:
- Use the full URL including protocol: https://your-n8n.com
- For local development: http://localhost:5678
- For n8n cloud: https://[your-instance].app.n8n.cloud
`,
    apiKey: `
Tips for apiKey:
- Generate API key in N8N: Settings > API Keys > Create API Key
- Copy the full key (starts with 'n8n_api_')
- Store in environment variables for security
- Never commit API keys to version control
`,
    timeout: `
Tips for timeout:
- Use milliseconds (e.g., 30000 for 30 seconds)
- Consider network latency and N8N response times
- Increase for complex workflows or slow networks
`,
  }

  return tips[error.field || ''] || 'Check N8N documentation for configuration details'
}