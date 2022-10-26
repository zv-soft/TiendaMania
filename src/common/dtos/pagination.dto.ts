import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsOptional, IsPositive, Min } from "class-validator"

export class PaginationDto{

  @ApiProperty({
    default:10,
  })
  @IsPositive()
  @IsOptional()
  @Type(()=>Number)
  limit?: number

  @ApiProperty({
    default:0,
  })
  @IsPositive()
  @IsOptional()
  @Min(0)
  @Type(()=>Number)
  offset?: number
}