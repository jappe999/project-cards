import { Injectable } from '@nestjs/common'
import { Deck } from '../deck.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DeckViewDto } from '../deck.dto'

@Injectable()
export class DecksService {
  constructor(
    @InjectRepository(Deck)
    private readonly deckRepository: Repository<Deck>,
  ) { }

  paginateKeys({
    skip = 0,
    take = 10,
    sort = 'RANDOM()',
    order = 'ASC',
  } = {}): { skip: number; take: number;[rest: string]: any } {
    skip = skip >= 0 ? skip : 0
    take = take < 50 && take >= 0 ? take : 10

    return { skip, take, sort, order }
  }

  findAll(query?: { [key: string]: any }): Promise<DeckViewDto[]> {
    const { skip, take, sort, order } = this.paginateKeys(query)

    return this.deckRepository
      .createQueryBuilder('deck')
      .skip(skip)
      .take(take)
      .orderBy(sort, order)
      .where(query)
      .getMany()
  }
}
