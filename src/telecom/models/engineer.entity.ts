import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

const TABLE_NAME = 'Engineers';

@Entity(TABLE_NAME)
export class EngineerEntity {
   public static readonly TABLE_NAME = TABLE_NAME;

   @PrimaryGeneratedColumn({type: 'int', unsigned: true})
   public readonly id!: number;

   @Column({type: 'varchar', length: 16, unique: true, nullable: false})
   public readonly login!: string;

   @Column({type: 'text', nullable: false})
   public readonly phash!: string;

   @Column({type: 'char', length: 32, nullable: false})
   public readonly salt!: string;
}
