import { Module } from '@nestjs/common'
import { DecksService } from './service/decks.service'
import { DecksController } from './controller/deck.controller'
import { Deck } from './deck.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([Deck])],
  providers: [DecksService],
  controllers: [DecksController],
  exports: [DecksService],
})
export class DecksModule { }
