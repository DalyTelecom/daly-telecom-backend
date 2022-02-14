import { ApiProperty } from '@nestjs/swagger';
import { AbonentEntity } from './abonent.entity';

export class AbonentList
{
   @ApiProperty({type: [AbonentEntity]})
   public readonly abonents!: AbonentEntity[];

   @ApiProperty({type: 'integer'})
   public readonly total!: number;

   @ApiProperty({type: 'integer'})
   public readonly totalPages!: number;

   @ApiProperty({type: 'integer'})
   public readonly pageNumber!: number;

   @ApiProperty({type: 'integer'})
   public readonly pageSize!: number;
}
