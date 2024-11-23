import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Logger } from 'src/logger/logger';

@Injectable()
export class ClientIpInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    let clientIp =
      req.headers['x-client-ip'] ||
      req.headers['x-real-ip'] ||
      req.headers['x-forwarded-for']?.split(',')[0].trim() ||
      req.connection.remoteAddress ||
      req.ip ||
      'unknown';

    clientIp = clientIp.startsWith('::ffff:')
      ? clientIp.replace('::ffff:', '')
      : clientIp;

    if (clientIp === '127.0.0.1' || clientIp === '::1') {
      clientIp = 'localhost';
    }

    this.logger.info(clientIp, 'ClientIpInterceptor');

    req.clientIp = clientIp;

    return next.handle();
  }
}
