import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsObject, IsOptional } from "class-validator"

export class ExecuteWorkflowDto {
  @ApiPropertyOptional({ description: "Input data for the workflow execution" })
  @IsOptional()
  @IsObject()
  data?: Record<string, any>

  @ApiPropertyOptional({ description: "Execution mode", enum: ["manual", "trigger", "webhook"] })
  @IsOptional()
  mode?: "manual" | "trigger" | "webhook"
}
