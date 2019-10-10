import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SessionsGateway } from './gateway/sessions.gateway'
import { SessionsService } from './service/sessions.service'
import { Session } from './session.entity'
import { CardsModule } from '../cards/cards.module'
import { AuthModule } from '../auth/auth.module'
import { PlayerSessionModule } from '../player-session/player-session.module'
import { UsersModule } from '../users/users.module'
import { GamesModule } from '../games/games.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Session]),
    GamesModule,
    CardsModule,
    AuthModule,
    UsersModule,
    PlayerSessionModule,
  ],
  providers: [SessionsService, SessionsGateway],
})
export class SessionsModule {}
