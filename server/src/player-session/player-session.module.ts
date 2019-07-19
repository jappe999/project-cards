import { Module } from '@nestjs/common'
import { PlayerSessionService } from './service/player-session.service'
import { PlayerInSession } from './player-session.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([PlayerInSession])],
  providers: [PlayerSessionService],
  exports: [PlayerSessionService],
})
export class PlayerSessionModule {}
