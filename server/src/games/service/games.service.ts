import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game, GameCreateDto } from '../game.entity';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
  ) {}

  async create(game: GameCreateDto) {
    const result = await this.gameRepository.insert(game);
    return result;
  }

  findAll(): Promise<Game[]> {
    return this.gameRepository.find();
  }
}
