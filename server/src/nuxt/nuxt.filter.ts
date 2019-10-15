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
    const error = exception.getResponse
      ? exception.getResponse()
      : exception.toString()

    if (typeof error === 'string') {
      return { error }
    }

    return error
  }

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const res = ctx.getResponse()
    const req = ctx.getRequest()
    const status = exception.getStatus ? exception.getStatus() : 500

    if (status === 404) {
      // if (!res.headersSent) {
      await this.nuxt.render(req, res)
      // }
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
