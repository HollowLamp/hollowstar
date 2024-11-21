import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.qq.com',
      port: 587,
      secure: false,
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
    });
  }

  async sendNotificationEmail(
    to: string,
    subject: string,
    nickname: string,
    content: string,
  ) {
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        <h2>新评论通知</h2>
        <p><strong>昵称:</strong> ${nickname || '匿名'}</p>
        <p><strong>评论内容:</strong></p>
        <blockquote style="border-left: 4px solid #ccc; padding-left: 10px; margin: 10px 0;">
          ${content}
        </blockquote>
        <p>请登录管理后台查看详情。</p>
      </div>
    `;

    await this.transporter.sendMail({
      from: {
        name: '博客通知',
        address: this.configService.get('EMAIL_USER'),
      },
      to,
      subject,
      html,
    });
  }
}
