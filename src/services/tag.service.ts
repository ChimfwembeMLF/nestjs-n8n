import type { N8nClientService } from "./n8n-client.service"
import type { Tag, CreateTagDto, UpdateTagDto, TagListResponse } from "../interfaces/tag.interface"

export class TagService {
  constructor(private readonly client: N8nClientService) {}

  /**
   * Get all tags
   */
  async list(): Promise<TagListResponse> {
    return this.client.get<TagListResponse>("/api/v1/tags")
  }

  /**
   * Get a specific tag by ID
   */
  async get(id: string): Promise<Tag> {
    return this.client.get<Tag>(`/api/v1/tags/${id}`)
  }

  /**
   * Create a new tag
   */
  async create(data: CreateTagDto): Promise<Tag> {
    return this.client.post<Tag>("/api/v1/tags", data)
  }

  /**
   * Update an existing tag
   */
  async update(id: string, data: UpdateTagDto): Promise<Tag> {
    return this.client.patch<Tag>(`/api/v1/tags/${id}`, data)
  }

  /**
   * Delete a tag
   */
  async delete(id: string): Promise<void> {
    return this.client.delete(`/api/v1/tags/${id}`)
  }

  /**
   * Get workflows associated with a tag
   */
  async workflows(id: string): Promise<any> {
    return this.client.get(`/api/v1/tags/${id}/workflows`)
  }
}
