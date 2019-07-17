import { Injectable } from '@nestjs/common'
import { UsersService } from '../../users/service/users.service'
import { UserViewDto } from 'server/src/users/user.dto'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<UserViewDto | null> {
    const user = await this.usersService.findOne({ where: { username } })

    if (user) {
      if (
        user.loginTime &&
        user.loginTime.getTime() + 60 * 60 * 1000 > Date.now()
      ) {
        return null
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

    return null
  }

  async login({ username, userId }: any) {
    const payload = { username, sub: userId }
    this.usersService.update({ username }, { loginTime: new Date() })

    return {
      access_token: this.jwtService.sign(payload),
    }
  }

  async logout({ username }: any) {
    this.usersService.update({ username }, { loginTime: null })
  }
}
