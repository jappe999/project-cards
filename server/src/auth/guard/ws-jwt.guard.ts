import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { verify } from 'jsonwebtoken'
import { AuthService } from '../service/auth.service'

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient()
    const token = client.handshake.headers.authorization.split(' ').pop()
    const { sub: id } = <{ sub: string }>verify(token, process.env.JWT_SECRET)
    const user = await this.authService.profile({ id })

    context.switchToWs().getData().user = user
    return Boolean(user)
  }
}
