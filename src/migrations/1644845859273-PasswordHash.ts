import {MigrationInterface, QueryRunner} from 'typeorm';

export class PasswordHash1644845859273 implements MigrationInterface
{
   public async up(qr: QueryRunner): Promise<void> {
      await qr.query(`
         ALTER TABLE Engineers
         DROP phone,
         ADD phash TEXT NOT NULL,
         ADD salt CHAR(32) NOT NULL;
      `);
   }

   public async down(qr: QueryRunner): Promise<void> {
      await qr.query(`
         ALTER TABLE Engineers
         ADD char(11) unique NOT NULL,
         DROP phash,
         DROP salt;
      `);
   }

}
