import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private configService: ConfigService) {
    super({
      log: [
        {
          emit: 'stdout',
          level: 'query',
        },
      ],
    });
  }

  async onModuleInit() {
    await this.$connect();
    await this.ensureAdminUser();
  }

  async ensureAdminUser() {
    const adminUsername = this.configService.get<string>('ADMIN_USERNAME');
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');

    const admin = await this.admin.findUnique({
      where: { username: adminUsername },
    });

    if (!admin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await this.admin.create({
        data: {
          username: adminUsername,
          password: hashedPassword,
        },
      });
      console.log('管理员账号已创建');
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
