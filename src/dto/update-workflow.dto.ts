import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsString, IsOptional, IsBoolean, IsObject, IsArray } from "class-validator"

export class UpdateWorkflowDto {
  @ApiPropertyOptional({ description: "The name of the workflow" })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({ description: "The nodes configuration of the workflow" })
  @IsOptional()
  @IsArray()
  nodes?: any[]

  @ApiPropertyOptional({ description: "The connections between nodes" })
  @IsOptional()
  @IsObject()
  connections?: Record<string, any>

  @ApiPropertyOptional({ description: "Whether the workflow is active" })
  @IsOptional()
  @IsBoolean()
  active?: boolean

  @ApiPropertyOptional({ description: "Workflow settings" })
  @IsOptional()
  @IsObject()
  settings?: Record<string, any>

  @ApiPropertyOptional({ description: "Static data for the workflow" })
  @IsOptional()
  @IsObject()
  staticData?: Record<string, any>

  @ApiPropertyOptional({ description: "Tags associated with the workflow" })
  @IsOptional()
  @IsArray()
  tags?: string[]
}
