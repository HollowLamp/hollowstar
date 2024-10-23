import {
  Catch,
  HttpException,
  ExceptionFilter,
  ArgumentsHost,
  Inject,
} from '@nestjs/common';
import { Logger } from '../../logger/logger';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  @Inject(Logger)
  private loggger: Logger;
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const logFormat = `
##############################################################################################################
Request original url: ${request.originalUrl}
Method: ${request.method}
IP: ${request.ip}
Status code: ${status}
Response: ${
      exception.toString() +
      `（${exceptionResponse?.message || exception.message}）`
    }
##############################################################################################################
`;
    this.loggger.error(logFormat, 'HttpException filter');
    response.status(status).json({
      code: status,
      message: exceptionResponse?.message || exception.message,
    });
  }
}
