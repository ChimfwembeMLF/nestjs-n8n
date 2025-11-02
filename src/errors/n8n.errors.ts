export class N8nConfigurationError extends Error {
  constructor(message: string, public field?: string) {
    super(`N8N Configuration Error: ${message}`)
    this.name = 'N8nConfigurationError'
  }
}

export class N8nConnectionError extends Error {
  constructor(baseUrl: string, public originalError: Error) {
    super(`Failed to connect to N8N at ${baseUrl}: ${originalError.message}`)
    this.name = 'N8nConnectionError'
  }
}

export class N8nAuthenticationError extends Error {
  constructor(apiKey: string) {
    const maskedKey = apiKey ? `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}` : '[empty]'
    super(`Authentication failed with N8N. Check your API key: ${maskedKey}`)
    this.name = 'N8nAuthenticationError'
  }
}

export class N8nValidationError extends Error {
  constructor(message: string, public details?: any) {
    super(`N8N Validation Error: ${message}`)
    this.name = 'N8nValidationError'
  }
}