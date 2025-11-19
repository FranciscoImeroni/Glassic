import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para desarrollo
  app.enableCors({
    origin: true, // En desarrollo permite todos los orígenes
    credentials: true,
  });

  // Prefijo global para todas las rutas de API
  app.setGlobalPrefix('api');

  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;

  await app.listen(port);
  console.log(`🚀 Server running on port ${port}`);
}
bootstrap();
