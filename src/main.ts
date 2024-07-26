import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder().setTitle('Auth API').setDescription('The Auth API description').setVersion('1.0').addTag('auth').build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(process.env.PORT || 7000);
}
bootstrap();
