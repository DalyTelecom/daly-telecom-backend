import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import { BasicAuthGuard } from './basic_auth.guard';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter
{
   constructor(
      private readonly _authService: BasicAuthGuard,
   ) {}

   public catch(exception: HttpException, host: ArgumentsHost): void
   {
      const ctx = host.switchToHttp();
      const res = ctx.getResponse<FastifyReply>();
      const status = exception.getStatus();

      if (status === 401 || status === 419) {
         res.header('Set-Cookie', this._authService.getClearAuthCookieH());
      }

      res.status(status).send(exception);
   }
}