import { Catch, ExceptionFilter, ArgumentsHost, Inject } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response } from 'express';
import { Logger } from '../../logger/logger';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  @Inject(Logger)
  private logger: Logger;

  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = 500;
    let message = '服务端未知错误';

    switch (exception.code) {
      case 'P2002':
        status = 409;
        message = '字段存在冲突';
        break;
      case 'P2025':
        status = 404;
        message = '内容未找到';
        break;
      default:
        message = exception.message;
    }
    const logFormat = `
##############################################################################################################
Request original url: ${request.originalUrl}
Method: ${request.method}
IP: ${request.ip}
Status code: ${status}
Error: ${exception.message}
##############################################################################################################
`;
    this.logger.error(logFormat, 'PrismaExceptionFilter');

    response.status(status).json({
      code: status,
      message,
    });
  }
}
