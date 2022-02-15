import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';


export class LightAbonent
{
   @ApiProperty({type: 'integer'})
   public readonly id!: number;

   @ApiPropertyOptional({type: String})
   public readonly name?: string | null;

   @ApiPropertyOptional({type: String})
   public readonly address?: string | null;

   @ApiPropertyOptional({type: String})
   public readonly phone?: string | null;
}
