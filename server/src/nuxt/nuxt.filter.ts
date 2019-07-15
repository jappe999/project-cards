import {
  ExceptionFilter,
  HttpException,
  ArgumentsHost,
  Catch,
} from '@nestjs/common'
import { Nuxt } from 'nuxt'

@Catch()
export class NuxtFilter implements ExceptionFilter {
  private readonly nuxt: Nuxt

  constructor(nuxt: Nuxt) {
    this.nuxt = nuxt
  }

  getResponse(exception: HttpException): Object {
    let response = exception.getResponse()
    if (typeof exception.getResponse() === 'string') {
      response = { error: exception.getResponse() }
    }
    return response
  }

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const res = ctx.getResponse()
    const req = ctx.getRequest()
    const status = exception.getStatus()

    if (status === 404) {
      if (!res.headersSent) {
        await this.nuxt.render(req, res)
      }
    } else {
      const response = this.getResponse(exception)
      res.status(status).json({
        ...response,
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: req.url,
      })
    }
  }
}
