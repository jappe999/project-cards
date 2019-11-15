import { Controller, Get, Query, UseGuards, Param } from '@nestjs/common'
import { CardViewDto } from '../card.dto'
import { CardsService } from '../service/cards.service'
import { AuthGuard } from '@nestjs/passport'
import { GamesService } from '../../games/service/games.service'
import { In } from 'typeorm'

@Controller('cards')
export class CardsController {
  constructor(
    private cardsService: CardsService,
    private gamesService: GamesService
  ) { }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async fetchAll(
    @Query() query: { [key: string]: any },
  ): Promise<CardViewDto[]> {
    let game = null
    if (query.gameId) {
      game = await this.gamesService.findOne({
        where: { id: query.gameId },
        relations: ['decks']
      })
    }

    return this.cardsService.findAll(game ? { ...query, deckId: In(game.decks.map(({ id }) => id)) } : query)
  }
}
