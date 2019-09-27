import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { CardViewDto } from '../card.dto'
import { CardsService } from '../service/cards.service'
import { AuthGuard } from '@nestjs/passport'

@Controller('api/cards')
export class CardsController {
  constructor(private cardsService: CardsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  fetchAll(@Query() query: { [key: string]: any }): Promise<CardViewDto[]> {
    return this.cardsService.findAll(query)
  }
}
