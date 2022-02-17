import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { config } from './config';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import path = require('path');
const { version, name, description } = require(path.join(process.cwd(), 'package.json'));

async function bootstrap(): Promise<NestFastifyApplication>
{
   const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
   );

   const swaggerConfig = new DocumentBuilder()
      .setTitle(name)
      .setDescription(description)
      .setVersion(version)
      .addCookieAuth()
      .build();
   const document = SwaggerModule.createDocument(app, swaggerConfig);
   SwaggerModule.setup('swagger', app, document);

   await app.listen(config.APP_PORT)
      .then(() => console.info(`App running on ${ config.APP_PORT }`));

   return app;
}
export default bootstrap();
