import { Controller, UseGuards, Post, Request, Get } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from '../service/auth.service'

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Request() { user }: { user: any }) {
    return this.authService.login(user)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  logout(@Request() { user }: { user: any }) {
    return this.authService.logout(user)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getProfile(@Request() { user }: { user: any }) {
    return this.authService.profile(user)
  }
}
