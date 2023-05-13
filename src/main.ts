import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  try {
    const PORT = process.env.PORT || 5000;
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');

    app.enableCors({
      credentials: true,
      origin: ['http://localhost:3000', 'https://anim-book.vercel.app'],
    });

    const config = new DocumentBuilder()
      .setTitle('AnimBook')
      .setDescription('The AnimBook API')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('AnimBook')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });

    await app.listen(PORT, () => console.log(`server started on PORT ${PORT}`));
  } catch (error) {
    console.log(error);
  }
}
bootstrap();
