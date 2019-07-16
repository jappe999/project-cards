import { Module } from '@nestjs/common'
import { AuthService } from './service/auth.service'
import { PassportModule } from '@nestjs/passport'
import { UsersModule } from '../users/users.module'
import { LocalStrategy } from './strategy/local.strategy'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './strategy/jwt.strategy'
import { AuthController } from './controller/auth.controller'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
    UsersModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
