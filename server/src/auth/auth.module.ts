import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { LocalStrategy } from './strategy/local.strategy'
import { JwtStrategy } from './strategy/jwt.strategy'
import { WsJwtGuard } from './guard/ws-jwt.guard'
import { AuthService } from './service/auth.service'
import { AuthController } from './controller/auth.controller'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
    UsersModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, WsJwtGuard],
  controllers: [AuthController],
  exports: [AuthService, LocalStrategy, JwtStrategy, WsJwtGuard],
})
export class AuthModule {}
