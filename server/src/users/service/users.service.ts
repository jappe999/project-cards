import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../user.entity'
import { FindOneOptions, Repository } from 'typeorm'
import { UserCreateDto } from '../user.dto'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findOne(options?: FindOneOptions): Promise<User> {
    return this.userRepository.findOne(options)
  }

  create(user: UserCreateDto): Promise<User> {
    return this.userRepository.save(user)
  }

  update(where: { [key: string]: any }, update: { [key: string]: any }) {
    return this.userRepository.update(where, update)
  }

  activeSessions(where: { [key: string]: any }) {
    return this.userRepository.findOne({
      relations: [
        'playerInSession',
        'playerInSession.session',
        'playerInSession.session.game',
      ],
      where,
    })
  }
}
