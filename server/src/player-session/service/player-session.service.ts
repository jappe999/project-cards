import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, FindOneOptions } from 'typeorm'
import { PlayerInSession } from '../player-session.entity'
import { Card } from '../../cards/card.entity'
import { User } from '../../users/user.entity'
import { Session } from '../../sessions/session.entity'

@Injectable()
export class PlayerSessionService {
  constructor(
    @InjectRepository(PlayerInSession)
    private readonly playerInSessionRepository: Repository<PlayerInSession>,
  ) {}

  async create(
    playerInSession: Partial<PlayerInSession>,
  ): Promise<PlayerInSession> {
    const row = (await this.findOne({ where: playerInSession })) || {}
    return this.playerInSessionRepository.save({ ...row, ...playerInSession })
  }

  findOne(options?: FindOneOptions): Promise<PlayerInSession> {
    return this.playerInSessionRepository.findOne(options)
  }

  update(where: { [key: string]: any }, update: { [key: string]: any }) {
    return this.playerInSessionRepository.update(where, update)
  }

  playCards({
    user,
    cards,
    session,
  }: {
    user: User
    cards: Card[]
    session: Session
  }) {
    return this.playerInSessionRepository.save({
      player: user,
      playerCards: cards,
      session,
    })
  }
}
