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

    if (user && user.password === pass) {
      const { password, ...result } = user
      return result
    }

    if (!user) {
      const { password, ...result } = await this.usersService.create({
        username,
        password: pass,
      })
      return result
    }

    return null
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}
