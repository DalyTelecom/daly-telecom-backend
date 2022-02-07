import { IsArray, IsInt, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AbonentBodyDto
{
   @ApiPropertyOptional({type: String})
   @IsString()
   @IsOptional()
   public readonly name?: string | null;

   @ApiPropertyOptional({type: String})
   @IsString()
   @IsOptional()
   public readonly address?: string | null;

   @ApiPropertyOptional({type: String})
   @IsString()
   @IsOptional()
   public readonly phone?: string | null;

   @ApiPropertyOptional({type: String})
   @IsString()
   @IsOptional()
   public readonly mobile?: string | null;

   @ApiPropertyOptional({type: 'integer'})
   @IsPositive()
   @IsInt()
   @IsNumber()
   @IsOptional()
   public readonly kross?: number | null;

   @ApiPropertyOptional({type: 'integer'})
   @IsPositive()
   @IsInt()
   @IsNumber()
   @IsOptional()
   public readonly magistral?: number | null;

   @ApiPropertyOptional({type: 'integer'})
   @IsPositive()
   @IsInt()
   @IsNumber()
   @IsOptional()
   public readonly raspred?: number | null;

   @ApiPropertyOptional({type: 'integer'})
   @IsPositive()
   @IsInt()
   @IsNumber()
   @IsOptional()
   public readonly adsl?: number | null;

   @ApiPropertyOptional({type: [String]})
   @IsString({each: true})
   @IsArray()
   @IsOptional()
   public readonly boxes: string[] = [];

   @ApiPropertyOptional({type: Number, format: 'double', example: 37.586452})
   @IsNumber()
   @IsOptional()
   public readonly latitude?: number | null;

   @ApiPropertyOptional({type: Number, format: 'double', example: 54.166907})
   @IsNumber()
   @IsOptional()
   public readonly longitude?: number | null;
}
