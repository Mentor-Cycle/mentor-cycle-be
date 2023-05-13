import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import graphqlUploadExpress = require('graphql-upload/graphqlUploadExpress.js');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      allowedHeaders: ['content-type'],
      origin: true,
      credentials: true,
    },
  });
  const config = new DocumentBuilder()
    .setTitle('Mentor Cycle')
    .setDescription(
      'Backend da aplicação mentor cycle, onde podemos conectar aprendizes a mentores',
    )
    .setVersion('1.0')
    .addTag('mentor-cycle')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 10 }));

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  await app.listen(process.env.PORT || 3030);
}

bootstrap();
