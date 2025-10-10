import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;

  await app.listen(port);
  console.log(`🚀 Server running on port ${port}`);
}
bootstrap();
