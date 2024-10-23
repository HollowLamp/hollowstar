import { Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { IsPublic } from './common/decorators/is-public.decorator';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

interface JwtUserData {
  userId: number;
  username: string;
}

declare module 'express' {
  interface Request {
    user: JwtUserData;
  }
}

@ApiTags('登录')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Inject()
  jwtService: JwtService;

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @IsPublic()
  @ApiOperation({
    summary: '管理员登录',
    description: '使用用户名和密码进行管理员登录，并获取 JWT token',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          example: 'admin',
          description: '管理员的用户名',
        },
        password: {
          type: 'string',
          example: 'your-password',
          description: '管理员的密码',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: '登录成功，返回 JWT token',
    schema: {
      example: {
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE2MDAwMDAwMDB9.5wpAGZLiBr6-u7B95_Y9K6w-M-NwRC_tFL2otChXqFI',
      },
    },
  })
  @ApiResponse({ status: 401, description: '登录失败，用户名或密码错误' })
  async login(@Req() req: Request) {
    console.log(req.user);
    const token = this.jwtService.sign({
      userId: req.user.userId,
      username: req.user.username,
    });

    return {
      token,
    };
  }
}
