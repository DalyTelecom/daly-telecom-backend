import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { FastifyRequest } from 'fastify';
import { Repository } from 'typeorm';
import { EngineerEntity } from './models';
import moment from 'moment';
import argon2 = require('argon2');
import crypto = require('crypto');
import qs = require('querystring');

const sessionExpiresException = new HttpException('Время сессии истекло. Повторно войдите в систему.', 419);
const unauthorizedException = new UnauthorizedException('Неверный логин и/или пароль');

const generateSecret = (): string => {
   // it is still random 16 bytes like uuid v4 but much shorter in a utf view
   return crypto.randomBytes(16).toString('base64url');
};

export const AUTH_HEADER = 'authorization';
const BASIC_AUTH_PREFIX = 'Basic';
const COOKIE_HEADER = 'cookie';

const ARGON_DELIMITER = '$';
const COOKIE_DELIMITER = '@';

const authCookieKey = `__Secure-${generateSecret()}`;
const cookieSalt = generateSecret();
const cookieArgonOptions = {salt: Buffer.from(cookieSalt, 'base64url')};

@Injectable()
export class BasicAuthGuard implements CanActivate
{
   public static readonly _argonPrefix$ = new Promise<string>(async (resolve) => {
      const hash = await argon2.hash(authCookieKey, cookieArgonOptions);
      const [empty, libName, version, options, _part1, _part2] = hash.split(ARGON_DELIMITER);
      const prefix = [empty, libName, version, options].join(ARGON_DELIMITER);
      resolve(prefix);
   });

   private static readonly _sessions = new Map<string, number>();

   constructor(
      @InjectRepository(EngineerEntity)
      private readonly _engineerEntityRepository: Repository<EngineerEntity>,
   ) {}

   public async canActivate(ctx: ExecutionContext): Promise<boolean> {
      try {
         const req = ctx.switchToHttp().getRequest<FastifyRequest>();

         const allCookies = req.headers[COOKIE_HEADER];
         if (typeof allCookies !== 'string') {
            throw unauthorizedException;
         }

         const parsed = qs.parse(allCookies, '; ');
         const authCookie = parsed[authCookieKey];
         if (typeof authCookie !== 'string') {
            throw unauthorizedException;
         }

         const argonPrefix = await BasicAuthGuard._argonPrefix$;
         const [payload, safeSignature] = authCookie.split(COOKIE_DELIMITER);
         const signature = Buffer.from(safeSignature, 'base64url').toString('utf-8');
         const hash = [argonPrefix, signature].join(ARGON_DELIMITER);

         const verified = await argon2.verify(hash, payload, cookieArgonOptions);
         if (verified !== true) {
            throw unauthorizedException;
         }

         const sessionExpires = BasicAuthGuard._sessions.get(payload);
         if (sessionExpires === undefined) {
            throw unauthorizedException;
         }

         if (new Date().valueOf() >= sessionExpires) {
            BasicAuthGuard._sessions.delete(payload);
            this.clearSessions();
            throw sessionExpiresException;
         }

         return true;
      }
      catch (err) {
         throw err instanceof HttpException
            ? err
            : unauthorizedException;
      }
   }

   public async login(login: string, password: string): Promise<string>
   {
      await this.sleep();

      try {
         const engineer = await this._engineerEntityRepository.findOne({ where: {login}});
         if (engineer === undefined) {
            throw unauthorizedException;
         }

         const isVerified = await argon2.verify(engineer.phash, password, {salt: Buffer.from(engineer.salt)});
         if (isVerified !== true) {
            throw unauthorizedException;
         }

         const sessionCookie = generateSecret();
         const hash = await argon2.hash(sessionCookie, cookieArgonOptions);
         const [_empty, _libName, _version, _options, part1, part2] = hash.split(ARGON_DELIMITER);
         const signature = [part1, part2].join(ARGON_DELIMITER);
         const safeSignature = Buffer.from(signature, 'utf-8').toString('base64url');
         const signed = [sessionCookie, safeSignature].join(COOKIE_DELIMITER);

         const now = moment();
         const expires = now.add(8, 'hours').toDate();

         const cookieVal = `${authCookieKey}=${signed}; Expires=${expires.toUTCString()}; SameSite; Secure; HttpOnly`;

         BasicAuthGuard._sessions.set(sessionCookie, expires.valueOf());

         return cookieVal;

      } catch {
         throw unauthorizedException;
      }
   }

   public async logout(cookieHeader?: string | null): Promise<void>{
      try {
         if (typeof cookieHeader !== 'string') {
            throw unauthorizedException;
         }

         const parsed = qs.parse(cookieHeader, '; ');
         const authCookie = parsed[authCookieKey];
         if (typeof authCookie !== 'string') {
            throw unauthorizedException;
         }

         const argonPrefix = await BasicAuthGuard._argonPrefix$;
         const [payload, safeSignature] = authCookie.split(COOKIE_DELIMITER);
         const signature = Buffer.from(safeSignature, 'base64url').toString('utf-8');
         const hash = [argonPrefix, signature].join(ARGON_DELIMITER);

         const verified = await argon2.verify(hash, payload, cookieArgonOptions);
         if (verified !== true) {
            throw unauthorizedException;
         }

         const sessionExpires = BasicAuthGuard._sessions.get(payload);
         if (sessionExpires === undefined) {
            throw unauthorizedException;
         }

         if (new Date().valueOf() >= sessionExpires) {
            BasicAuthGuard._sessions.delete(payload);
            this.clearSessions();
            throw sessionExpiresException;
         }

         BasicAuthGuard._sessions.delete(payload);
      }
      catch (err) {
         throw err instanceof HttpException
            ? err
            : unauthorizedException;
      }
   }

   protected async checkEngineerAuthorization(login: string, password: string): Promise<boolean>
   {
      await this.sleep();

      try {
         const engineer = await this._engineerEntityRepository.findOne({ where: {login}});
         if (engineer === undefined) {
            throw new Error();
         }

         const isVerified = await argon2.verify(engineer.phash, password, {salt: Buffer.from(engineer.salt)});
         if (isVerified !== true) {
            throw new Error();
         }

         return true;

      } catch {
         throw unauthorizedException;
      }
   }

   protected parseAuthHeader(authHeader: string | unknown): {login: string, password: string}
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
      const sleepPeriod = crypto.randomInt(100, 150);
      return new Promise((r) => setTimeout(r, sleepPeriod));
   }

   private clearSessions(): void {
      const veryLongTimeAgo = moment().subtract(5, 'days').valueOf();
      const sessions = BasicAuthGuard._sessions;
      sessions.forEach((expires, sessionKey) => {
         if (veryLongTimeAgo >= expires) {
            sessions.delete(sessionKey);
         }
      });
   }

   public getClearAuthCookieH(): string {
      return `${authCookieKey}; Expires=-1`;
   }
}