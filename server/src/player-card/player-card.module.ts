import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PlayerInCard } from './player-card.entity'
import { PlayerCardService } from './service/player-card.service'

@Module({
  imports: [TypeOrmModule.forFeature([PlayerInCard])],
  providers: [PlayerCardService],
  exports: [PlayerCardService],
})
export class PlayerCardModule {}
