import { Controller, Get, Query } from '@nestjs/common'
import { CardViewDto } from '../card.dto'
import { CardsService } from '../service/cards.service'

@Controller('api/cards')
export class CardsController {
  constructor(private cardsService: CardsService) {}

  @Get()
  fetchAll(@Query() query: { [key: string]: any }): Promise<CardViewDto[]> {
    return this.cardsService.findAll(query)
  }
}
