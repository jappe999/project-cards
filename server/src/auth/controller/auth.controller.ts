import { Controller, UseGuards, Post, Request, Get } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from '../service/auth.service'
import { CurrentUser } from '../../users/decorator/user.decorator'
import { UserCreateDto, UserViewDto } from '../../users/user.dto'
import { User } from '../../users/user.entity'

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@CurrentUser() user: UserCreateDto) {
    return this.authService.login(user)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  logout(@CurrentUser() user: UserViewDto) {
    return this.authService.logout(user)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getProfile(@CurrentUser() user: User) {
    return user
  }
}
