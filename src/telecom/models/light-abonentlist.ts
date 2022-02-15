import { ApiProperty } from '@nestjs/swagger';
import { LightAbonent } from './light-abonent';

export class LightAbonentList
{
   @ApiProperty({type: [LightAbonent]})
   public readonly abonents!: LightAbonent[];

   @ApiProperty({type: 'integer'})
   public readonly total!: number;

   @ApiProperty({type: 'integer'})
   public readonly totalPages!: number;

   @ApiProperty({type: 'integer'})
   public readonly pageNumber!: number;

   @ApiProperty({type: 'integer'})
   public readonly pageSize!: number;
}
