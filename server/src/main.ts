import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import consola from 'consola'
import pkg from '../../package.json'
import { AppModule } from './app.module'
import config from '../../nuxt.config'
import NuxtServer from './nuxt'
import { NuxtFilter } from './nuxt/nuxt.filter'
import { ValidationPipe } from '@nestjs/common'

declare const module: any

async function bootstrap() {
  const { port } = config.env
  const app = await NestFactory.create(AppModule, { cors: true })

  app.setGlobalPrefix('api')

  if (process.env.NODE_ENV !== 'production') {
    const options = new DocumentBuilder()
      .setTitle('Project Cards')
      .setDescription('The Project Cards API description')
      .setVersion(pkg.version)
      .build()
    const document = SwaggerModule.createDocument(app, options)
    SwaggerModule.setup('docs', app, document)
  }

  const nuxt = await NuxtServer.getInstance().run(
    config.dev ? !module.hot._main : true,
  )

  app.useGlobalFilters(new NuxtFilter(nuxt))
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));

  await app.listen(port, () => {
    consola.ready({
      message: `App listening on port ${port}`,
      badge: true,
    })
  })

  if (config.dev && module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }
}

bootstrap()
