import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './src/app.module';
import { Nuxt } from '@nuxt/core';
import { Builder } from '@nuxt/builder';
import config from './nuxt.config';

async function bootstrap() {
  const port = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule, { cors: true });

  if (process.env.NODE_ENV !== 'production') {
    const options = new DocumentBuilder()
      .setTitle('Project Cards')
      .setDescription('The Project Cards API description')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('docs', app, document);
  }

  const nuxt = await new Nuxt(config);

  if (config.dev) {
    await new Builder(nuxt).build();
  } else {
    await nuxt.ready()
  }

  app.use(nuxt.render);

  await app.listen(port);
  console.log(`Listening on port ${port}`);
}

bootstrap();
