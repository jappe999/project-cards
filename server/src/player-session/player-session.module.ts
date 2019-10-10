import { Module } from '@nestjs/common'
import { PlayerSessionService } from './service/player-session.service'
import { PlayerInSession } from './player-session.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PlayerCardModule } from '../player-card/player-card.module'

@Module({
  imports: [TypeOrmModule.forFeature([PlayerInSession]), PlayerCardModule],
  providers: [PlayerSessionService],
  exports: [PlayerSessionService],
})
export class PlayerSessionModule {}
