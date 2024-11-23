import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Logger } from '../../logger/logger';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const clientIp = req.clientIp || 'unknown';
    const now = Date.now();

    return next.handle().pipe(
      tap((data) => {
        const logFormat = `
##############################################################################################################
Request original url: ${req.originalUrl}
Method: ${req.method}
IP: ${clientIp}
Response data: ${JSON.stringify(data)}
Duration: ${Date.now() - now}ms
##############################################################################################################
`;
        this.logger.info(logFormat, 'LoggerInterceptor');
      }),
    );
  }
}
