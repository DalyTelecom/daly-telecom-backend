import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

export class PaginationQuery
{
   @ApiPropertyOptional({type: 'integer', default: DEFAULT_PAGE_NUMBER})
   @IsPositive()
   @IsInt()
   @Transform(({value}) => value ? Number(value) : value)
   @IsOptional()
   public readonly pageNumber = DEFAULT_PAGE_NUMBER;

   @ApiPropertyOptional({type: 'integer', default: DEFAULT_PAGE_SIZE, maximum: MAX_PAGE_SIZE})
   @IsPositive()
   @IsInt()
   @Transform(({value}) => {
      const querySize = value ? Number(value) : DEFAULT_PAGE_SIZE;
      return Math.min(querySize, MAX_PAGE_SIZE);
   })
   @IsOptional()
   public readonly pageSize = DEFAULT_PAGE_SIZE;

   @ApiPropertyOptional({type: String})
   @IsString()
   @IsOptional()
   public readonly name: string = '';

   @ApiPropertyOptional({type: String})
   @IsString()
   @IsOptional()
   public readonly phone: string = '';

   @ApiPropertyOptional({type: String})
   @IsString()
   @IsOptional()
   public readonly address: string = '';
}
