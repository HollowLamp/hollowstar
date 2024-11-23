import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RealIp = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const forwardedFor =
      request.headers['cf-connecting-ip'] || request.headers['x-forwarded-for'];
    const realIp = forwardedFor
      ? Array.isArray(forwardedFor)
        ? forwardedFor[0]
        : forwardedFor.split(',')[0].trim()
      : request.ip;

    return realIp;
  },
);
