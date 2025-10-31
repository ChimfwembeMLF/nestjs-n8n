export interface Tag {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface CreateTagDto {
  name: string
}

export interface UpdateTagDto {
  name: string
}

export interface TagListResponse {
  data: Tag[]
}
