import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, FindOneOptions } from 'typeorm'
import { PlayerInSession } from '../player-session.entity'
import { Card } from '../../cards/card.entity'
import { User } from '../../users/user.entity'
import { Session } from '../../sessions/session.entity'
import { PlayerInCard } from '../player-card.entity'

@Injectable()
export class PlayerSessionService {
  constructor(
    @InjectRepository(PlayerInSession)
    private readonly playerInSessionRepository: Repository<PlayerInSession>,
    @InjectRepository(PlayerInCard)
    private readonly playerInCardRepository: Repository<PlayerInCard>,
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

  async remove(where: { [key: string]: any }) {
    await this.playerInCardRepository.delete(where)
    return this.playerInSessionRepository.delete(where)
  }

  async playCards({
    user,
    cards,
    session,
  }: {
    user: User
    cards: Card[]
    session: Session
  }) {
    const playerSession = await this.playerInSessionRepository.save({
      player: user,
      session,
    })

    await this.playerInCardRepository.save({
      round: 1,
      playerSession,
      cards,
    })

    return this.playerInSessionRepository.findOne(playerSession.id, {
      relations: ['playerCards', 'playerCards.cards'],
    })
  }
}
