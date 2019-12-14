import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, FindOneOptions, FindConditions } from 'typeorm'
import { Game } from '../game.entity'
import { GameCreateDto } from '../game.dto'

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
  ) { }

  create(game: GameCreateDto): Promise<Game> {
    return this.gameRepository.save(game)
  }

  update(game: GameCreateDto): Promise<Game> {
    return this.gameRepository.save(game)
  }

  remove(options: string | string[] | number | number[] | Date | Date[] | FindConditions<Game>) {
    return this.gameRepository.delete(options)
  }

  findAll(): Promise<Game[]> {
    return this.gameRepository.find({
      relations: [
        'session',
        'session.playerInSession',
        'session.playerInSession.player',
      ],
    })
  }

  findOne(options?: FindOneOptions): Promise<Game> {
    return this.gameRepository.findOne(options)
  }
}
