export interface Credential {
  id: string
  name: string
  type: string
  data?: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface CredentialType {
  name: string
  displayName: string
  properties: CredentialProperty[]
  documentationUrl?: string
  icon?: string
}

export interface CredentialProperty {
  name: string
  displayName: string
  type: string
  default?: any
  required?: boolean
  description?: string
}

export interface CreateCredentialDto {
  name: string
  type: string
  data: Record<string, any>
}

export interface UpdateCredentialDto {
  name?: string
  data?: Record<string, any>
}

export interface CredentialListResponse {
  data: Credential[]
  nextCursor?: string
}

export interface CredentialTypeListResponse {
  data: CredentialType[]
}
