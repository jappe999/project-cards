import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { verify, decode } from 'jsonwebtoken'
import { UsersService } from '../../users/service/users.service'
import { UserViewDto, UserCreateDto } from '../../users/user.dto'
import { Socket } from 'socket.io'
import bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  private static readonly SALT_ROUNDS = 10

  private static readonly ERROR_USER_REGISTRATION = 'Cannot register user.'
  private static readonly ERROR_USER_LOGGED_IN = 'User already logged in.'
  private static readonly ERROR_LOGIN_INCORRECT = 'User or password incorrect.'

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Try to decode the token. Return an empty sub otherwise.
   * @param client - The connected socket
   */
  getTokenFromWsClient(client: Socket): { sub: string } {
    const token = client.handshake.headers.authorization.split(' ').pop()

    try {
      return <{ sub: string }>verify(token, process.env.JWT_SECRET)
    } catch (x) {
      try {
        return <{ sub: string }>decode(token)
      } catch (y) {
        return { sub: null }
      }
    }
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

      if (await this.validatePassword(user, pass)) {
        const { password, ...result } = user
        return result
      }
    } else {
      return this.register({ username, password: pass })
    }

    return AuthService.ERROR_LOGIN_INCORRECT
  }

  profile({ id }) {
    return this.usersService.findOne({ where: { id } })
  }

  async register(user: UserCreateDto): Promise<UserViewDto | string> {
    try {
      user.password = await bcrypt.hash(user.password, AuthService.SALT_ROUNDS)
      const { password, ...result } = await this.usersService.create(user)
      return result
    } catch (error) {
      return AuthService.ERROR_USER_REGISTRATION
    }
  }

  async validatePassword(
    user: UserCreateDto,
    password: string,
  ): Promise<boolean> {
    return bcrypt.compare(
      password, // Unhashed password
      user.password, // Hashed password
    )
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
