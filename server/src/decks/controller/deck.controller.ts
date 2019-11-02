import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { DeckViewDto } from '../deck.dto'
import { DecksService } from '../service/decks.service'
import { AuthGuard } from '@nestjs/passport'

@Controller('decks')
export class DecksController {
  constructor(private decksService: DecksService) { }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  fetchAll(@Query() query: { [key: string]: any }): Promise<DeckViewDto[]> {
    return this.decksService.findAll(query)
  }
}
