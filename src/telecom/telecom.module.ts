import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelecomControllerV1 } from './telecom.controller.v1';
import { TelecomControllerV2 } from './telecom.controller.v2';
import { AbonentEntity, EngineerEntity } from './models';
import { BasicAuthGuard } from './basic_auth.guard';

@Module({
   imports: [
      TypeOrmModule.forFeature([AbonentEntity, EngineerEntity]),
   ],
   controllers: [
      TelecomControllerV2,
      TelecomControllerV1,
   ],
   providers: [
      BasicAuthGuard,
   ],
})
export class TelecomModule {}
