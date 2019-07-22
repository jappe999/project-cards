import { Module } from '@nestjs/common'
import { PlayerSessionService } from './service/player-session.service'
import { PlayerInSession } from './player-session.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PlayerInCard } from './player-card.entity'

@Module({
  imports: [TypeOrmModule.forFeature([PlayerInSession, PlayerInCard])],
  providers: [PlayerSessionService],
  exports: [PlayerSessionService],
})
export class PlayerSessionModule {}
