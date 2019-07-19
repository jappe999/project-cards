import { Controller, Get, Post, Body, Param } from '@nestjs/common'
import { GameCreateDto } from '../game.dto'
import { GamesService } from '../service/games.service'
import { Game } from '../game.entity'

@Controller('api/games')
export class GamesController {
  constructor(private gamesService: GamesService) {}

  @Get()
  listGame(): Promise<Game[]> {
    return this.gamesService.findAll()
  }

  @Post()
  createGame(@Body() game: GameCreateDto) {
    return this.gamesService.create(game)
  }

  @Get(':id')
  findGame(@Param() { id }: { id: string }): Promise<Game> {
    return this.gamesService.findOne({ where: { id } })
  }
}
