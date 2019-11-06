import { Injectable } from '@nestjs/common'
import { Card } from '../card.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CardViewDto } from '../card.dto'

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
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

  findAll(query?: { [key: string]: any }): Promise<CardViewDto[]> {
    const { skip, take, sort, order } = this.paginateKeys(query)

    return this.cardRepository
      .createQueryBuilder('card')
      .skip(skip)
      .take(take)
      .orderBy(sort, order)
      .where(query)
      .getMany()
  }
}
