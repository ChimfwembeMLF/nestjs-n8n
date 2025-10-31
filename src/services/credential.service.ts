import type { N8nClientService } from "./n8n-client.service"
import type {
  Credential,
  CreateCredentialDto,
  UpdateCredentialDto,
  CredentialListResponse,
  CredentialType,
  CredentialTypeListResponse,
} from "../interfaces/credential.interface"

export class CredentialService {
  constructor(private readonly client: N8nClientService) {}

  /**
   * Get all credentials
   */
  async list(limit?: number, cursor?: string): Promise<CredentialListResponse> {
    const params = new URLSearchParams()
    if (limit) params.append("limit", limit.toString())
    if (cursor) params.append("cursor", cursor)

    const query = params.toString() ? `?${params.toString()}` : ""
    return this.client.get<CredentialListResponse>(`/api/v1/credentials${query}`)
  }

  /**
   * Get a specific credential by ID
   */
  async get(id: string): Promise<Credential> {
    return this.client.get<Credential>(`/api/v1/credentials/${id}`)
  }

  /**
   * Create a new credential
   */
  async create(data: CreateCredentialDto): Promise<Credential> {
    return this.client.post<Credential>("/api/v1/credentials", data)
  }

  /**
   * Update an existing credential
   */
  async update(id: string, data: UpdateCredentialDto): Promise<Credential> {
    return this.client.patch<Credential>(`/api/v1/credentials/${id}`, data)
  }

  /**
   * Delete a credential
   */
  async delete(id: string): Promise<void> {
    return this.client.delete(`/api/v1/credentials/${id}`)
  }

  /**
   * Get all available credential types
   */
  async types(): Promise<CredentialTypeListResponse> {
    return this.client.get<CredentialTypeListResponse>("/api/v1/credentials/types")
  }

  /**
   * Get a specific credential type
   */
  async getType(typeName: string): Promise<CredentialType> {
    return this.client.get<CredentialType>(`/api/v1/credentials/types/${typeName}`)
  }

  /**
   * Test a credential
   */
  async test(id: string): Promise<{ success: boolean; message?: string }> {
    return this.client.post(`/api/v1/credentials/${id}/test`)
  }
}
