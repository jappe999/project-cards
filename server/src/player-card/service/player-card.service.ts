import { Injectable } from '@nestjs/common'
import { PlayerInCard } from '../player-card.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PlayerInCardCreateDto } from '../player-card.dto'

@Injectable()
export class PlayerCardService {
  constructor(
    @InjectRepository(PlayerInCard)
    private readonly playerInCardRepository: Repository<PlayerInCard>,
  ) {}

  create(entity: PlayerInCardCreateDto) {
    return this.playerInCardRepository.save(entity)
  }

  remove(where: { [key: string]: any }) {
    return this.playerInCardRepository.delete(where)
  }
}
