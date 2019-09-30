import { Controller, Get, Post, Param, UseGuards, Body } from '@nestjs/common'
import { GameCreateDto } from '../game.dto'
import { GamesService } from '../service/games.service'
import { Game } from '../game.entity'
import { AuthGuard } from '@nestjs/passport'
import { User } from '../../users/user.entity'
import { CurrentUser } from '../../users/decorator/user.decorator'

@Controller('api/games')
export class GamesController {
  constructor(private gamesService: GamesService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  listGame(): Promise<Game[]> {
    return this.gamesService.findAll()
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createGame(@CurrentUser() user: User, @Body() game: GameCreateDto) {
    game.creator = user
    return this.gamesService.create(game)
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findGame(@Param() { id }: { id: string }): Promise<Game> {
    return this.gamesService.findOne({ where: { id } })
  }
}
