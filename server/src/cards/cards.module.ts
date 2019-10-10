import { Module } from '@nestjs/common'
import { CardsService } from './service/cards.service'
import { CardsController } from './controller/cards.controller'
import { Card } from './card.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([Card])],
  providers: [CardsService],
  controllers: [CardsController],
  exports: [CardsService],
})
export class CardsModule {}
