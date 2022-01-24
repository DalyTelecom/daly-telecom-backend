import { Column, Entity, PrimaryGeneratedColumn, ValueTransformer } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const boxesTransformer: ValueTransformer = {
   to(val?: string[] | null): string | null {
      if (Array.isArray(val) !== true) {
         return null;
      }
      return JSON.stringify(val);
   },

   from(val: string): string[] {
      try {
         if (!val) {
            return [];
         }
         if (Array.isArray(val) && val.length === 0) {
            return [];
         }

         const parsed: string[] = JSON.parse(val);
         return parsed;
      }
      catch (err) {
         console.info('somefing wrong at the boxesTransformer.from');
         console.info('value is:');
         console.info(val);
         console.info('error:');
         console.info(err);
         return [];
      }
   },
};

const TABLE_NAME = 'Abonents';

@Entity(TABLE_NAME)
export class AbonentEntity {
   public static readonly TABLE_NAME = TABLE_NAME;

   @ApiProperty({type: 'integer'})
   @PrimaryGeneratedColumn({type: 'int', unsigned: true})
   public id!: number;

   @ApiPropertyOptional({type: String})
   @Column({type: 'varchar', length: 64, nullable: true, default: null})
   public name?: string | null;

   @ApiPropertyOptional({type: String})
   @Column({type: 'varchar', length: 64, nullable: true, default: null})
   public address?: string | null;

   @ApiPropertyOptional({type: String})
   @Column({type: 'varchar', length: 16, nullable: true, default: null})
   public phone?: string | null;

   @ApiPropertyOptional({type: String})
   @Column({type: 'varchar', length: 16, nullable: true, default: null})
   public mobile?: string | null;

   @ApiPropertyOptional({type: 'integer'})
   @Column({type: 'int', unsigned: true, nullable: true, default: null})
   public kross?: number | null;

   @ApiPropertyOptional({type: 'integer'})
   @Column({type: 'int', unsigned: true, nullable: true, default: null})
   public magistral?: number | null;

   @ApiPropertyOptional({type: 'integer'})
   @Column({type: 'int', unsigned: true, nullable: true, default: null})
   public raspred?: number | null;

   @ApiPropertyOptional({type: 'integer'})
   @Column({type: 'int', unsigned: true, nullable: true, default: null})
   public adsl?: number | null;

   @ApiPropertyOptional({type: [String]})
   @Column({type: 'text', transformer: boxesTransformer, nullable: true, default: null})
   public boxes?: string[] | null;

   @ApiPropertyOptional({type: Number, format: 'double', example: 37.586452})
   @Column({type: 'double', nullable: true, default: null})
   public latitude?: number | null;

   @ApiPropertyOptional({type: Number, format: 'double', example: 54.166907})
   @Column({type: 'double', nullable: true, default: null})
   public longitude?: number | null;
}
