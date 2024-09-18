import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { config } from 'dotenv';
import { setupSwagger } from './common/utils/setup-swagger';
import { ConfigService } from '@nestjs/config';

config();
const configService = new ConfigService();

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.create(AppModule);

  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'", "http://localhost:3000"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    referrerPolicy: { policy: 'no-referrer-when-downgrade' },
  }));
  app.setGlobalPrefix('api', { exclude: ['/'] });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  setupSwagger(app);

  await app.listen(configService.get('PORT_API'));
  const url = await app
    .getUrl()
    .then((url) =>
      url.includes('[::1]') ? url.replace('[::1]', 'localhost') : url,
    );
  logger.verbose(`Server is running on ${url}`);
}
bootstrap();
