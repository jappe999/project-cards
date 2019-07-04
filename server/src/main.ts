import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import config from '../../nuxt.config';
import consola from 'consola';
import NuxtServer from './nuxt';
import { NuxtFilter } from './nuxt/nuxt.filter';

declare const module: any;

async function bootstrap() {
  const { host, port } = config.env;
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

  const nuxt = await NuxtServer.getInstance().run(
    config.dev ? !module.hot._main : true,
  );

  app.useGlobalFilters(new NuxtFilter(nuxt));

  await app.listen(port, host, () => {
    consola.ready({
      message: `App listening on http://${host}:${port}`,
      badge: true,
    });
  });

  if (config.dev && module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
