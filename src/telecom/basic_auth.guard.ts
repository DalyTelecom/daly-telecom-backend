import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { FastifyRequest } from 'fastify';
import { Repository } from 'typeorm';
import { EngineerEntity } from './models';
import argon2 = require('argon2');
import crypto = require('crypto');

export const AUTH_HEADER = 'authorization';
const BASIC_AUTH_PREFIX = 'Basic';

@Injectable()
export class BasicAuthGuard implements CanActivate
{
   constructor(
      @InjectRepository(EngineerEntity)
      private readonly _engineerEntityRepository: Repository<EngineerEntity>,
   ) {}

   public async canActivate(ctx: ExecutionContext): Promise<boolean> {
      const req = ctx.switchToHttp().getRequest<FastifyRequest>();

      const authHeader = req.headers[AUTH_HEADER];
      const {login, password} = this.parseAuthHeader(authHeader);

      return this.checkEngineerAuthorization(login, password);
   }

   public async checkEngineerAuthorization(login: string, password: string): Promise<boolean>
   {
      try {
         const engineer = await this._engineerEntityRepository.findOne({ where: {login}});
         if (engineer === undefined) {
            throw new Error();
         }

         const isVerified = await argon2.verify(engineer.phash, password, {salt: Buffer.from(engineer.salt)});
         if (isVerified !== true) {
            throw new Error();
         }

         await this.sleep();
         return true;

      } catch {
         await this.sleep();
         throw new UnauthorizedException('Неверный логин и/или пароль');
      }
   }

   private parseAuthHeader(authHeader: string | unknown): {login: string, password: string}
   {
      if (typeof authHeader !== 'string') {
         throw new UnauthorizedException('Не передан авторизационный заголовок');
      }

      const [prefix, encoded] = authHeader.split(' ');
      if (prefix !== BASIC_AUTH_PREFIX) {
         throw new UnauthorizedException('Авторизационный заголовок имеет неправильную структуру');
      }
      if (!encoded) {
         throw new UnauthorizedException('Авторизационный заголовок имеет неправильную структуру');
      }

      const decoded = Buffer.from(encoded, 'base64').toString('utf-8');

      const [login, password] = decoded.split(':');
      if (!login || !password) {
         throw new UnauthorizedException('Авторизационный заголовок имеет неправильную структуру');
      }

      return {login, password};
   }

   protected generateBasicAuthHeader(login: string, password: string): string {
      return 'Basic ' + Buffer.from(login + ':' + password).toString('base64');
   }

   private async sleep(): Promise<void> {
      const sleepPeriod = crypto.randomInt(1000, 1500);
      return new Promise((r) => setTimeout(r, sleepPeriod));
   }
}