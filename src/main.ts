import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.setGlobalPrefix(configService.get('api_prefix'));
  app.useGlobalPipes(new ValidationPipe());
  const options = new DocumentBuilder()
    .setTitle(configService.get('swagger_title'))
    .setDescription(configService.get('swagger_desc'))
    .setVersion(configService.get('swagger_api_version'))
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(configService.get('swagger_path'), app, document);

  await app.listen(configService.get('server_port'));
}
bootstrap();
