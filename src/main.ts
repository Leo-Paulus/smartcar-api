// src/main.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties without decorators
      forbidNonWhitelisted: true, // Throw error on unknown properties
      transform: true, // Transform payloads to DTO instances
    }),
  );

  // Allow class-validator to use NestJS modules (optional)
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Set up Swagger (we'll cover this in the next section)
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
