import { Controller, UseGuards, Post, Request, Get } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from 'server/src/auth/service/auth.service'
import { UsersService } from 'server/src/users/service/users.service'

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() { user }: { user: any }) {
    return this.authService.login(user)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@Request() { user }: { user: any }) {
    return this.authService.logout(user)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getProfile(@Request() { user: { id } }: { user: any }) {
    return this.usersService.findOne({ where: { id } })
  }
}
