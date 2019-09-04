import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { AuthService } from '../service/auth.service'

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient()
    const { sub: id } = this.authService.getTokenFromWsClient(client)

    if (id === null) {
      return false
    }

    const user = await this.authService.profile({ id })

    context.switchToWs().getData().user = user
    return Boolean(user)
  }
}
