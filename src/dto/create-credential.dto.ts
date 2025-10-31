import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsString, IsOptional, IsObject } from "class-validator"

export class CreateCredentialDto {
  @ApiProperty({ description: "The name of the credential" })
  @IsString()
  name: string

  @ApiProperty({ description: "The type of credential (e.g., httpBasicAuth, oAuth2Api)" })
  @IsString()
  type: string

  @ApiProperty({ description: "The credential data (encrypted by n8n)" })
  @IsObject()
  data: Record<string, any>

  @ApiPropertyOptional({ description: "Additional nodes that can access this credential" })
  @IsOptional()
  @IsObject()
  nodesAccess?: Array<{ nodeType: string }>
}
