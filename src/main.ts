// src/main.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet()); // Secures HTTP headers

  // Enable ValidationPipe with transform option and sanitize
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Transforms the data to the DTO
      whitelist: true, // Strips away any extra properties
      forbidNonWhitelisted: true, // Throws an error if extra properties are present
    }),
  );

  // Allow class-validator to use NestJS modules
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Set up Swagger
  const config = new DocumentBuilder()
    .setTitle('Smartcar API')
    .setDescription('API documentation for the Smartcar service')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
