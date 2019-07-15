import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../user.entity'
import { FindOneOptions, Repository } from 'typeorm'
import { UserCreateDto } from '../user.dto'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly gameRepository: Repository<User>,
  ) {}

  findOne(options?: FindOneOptions): Promise<User> {
    return this.gameRepository.findOne(options)
  }

  create(user: UserCreateDto): Promise<User> {
    return this.gameRepository.save(user)
  }
}
