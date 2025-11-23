import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefijo global para todas las rutas de API
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET','HEAD','POST','PUT','PATCH','DELETE','OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type','Authorization'],
  });

  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;

  await app.listen(port);
  console.log(`🚀 Server running on port ${port}`);
}
bootstrap();
