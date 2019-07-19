import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, InsertResult, FindOneOptions } from 'typeorm'
import { Game } from '../game.entity'
import { GameCreateDto } from '../game.dto'

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
  ) {}

  create(game: GameCreateDto): Promise<Game> {
    return this.gameRepository.save(game)
  }

  findAll(): Promise<Game[]> {
    return this.gameRepository.find()
  }

  findOne(options?: FindOneOptions): Promise<Game> {
    return this.gameRepository.findOne(options)
  }
}
