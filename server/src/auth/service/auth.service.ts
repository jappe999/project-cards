import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { verify } from 'jsonwebtoken'
import { UsersService } from '../../users/service/users.service'
import { UserViewDto } from '../../users/user.dto'
import { Socket } from 'socket.io'

@Injectable()
export class AuthService {
  private static readonly ERROR_USER_LOGGED_IN = 'User already logged in.'
  private static readonly ERROR_LOGIN_INCORRECT = 'User or password incorrect.'

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  getTokenFromWsClient(client: Socket) {
    const token = client.handshake.headers.authorization.split(' ').pop()
    return <{ sub: string }>verify(token, process.env.JWT_SECRET)
  }

  async validateUser(
    username: string,
    pass: string,
  ): Promise<UserViewDto | string> {
    const user = await this.usersService.findOne({ where: { username } })

    if (user) {
      if (
        user.loginTime &&
        user.loginTime.getTime() + 60 * 60 * 1000 > Date.now()
      ) {
        return AuthService.ERROR_USER_LOGGED_IN
      }

      if (user.password === pass) {
        const { password, ...result } = user
        return result
      }
    } else {
      const { password, ...result } = await this.usersService.create({
        username,
        password: pass,
      })
      return result
    }

    return AuthService.ERROR_LOGIN_INCORRECT
  }

  profile({ id }) {
    return this.usersService.findOne({ where: { id } })
  }

  async login({ id, username }: any) {
    await this.usersService.update({ username }, { loginTime: new Date() })

    return {
      access_token: this.jwtService.sign({ sub: id, username }),
    }
  }

  logout({ id }: any) {
    return this.usersService.update({ id }, { loginTime: null })
  }
}
