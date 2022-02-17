import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set config for Swagger for this framework
  const options = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API')
    .setVersion('1.0')
    .addTag('Cats')
    .build();

    const document = SwaggerModule.createDocument(app, options)
    SwaggerModule.setup('api', app, document)

  await app.listen(3000);
}
bootstrap();