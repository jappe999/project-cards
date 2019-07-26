import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, FindOneOptions } from 'typeorm'
import { PlayerInSession } from '../player-session.entity'
import { Card } from '../../cards/card.entity'
import { User } from '../../users/user.entity'
import { Session } from '../../sessions/session.entity'
import { PlayerCardService } from '../../player-card/service/player-card.service'
import { PlayerInSessionCreateDto } from '../player-session.dto'

@Injectable()
export class PlayerSessionService {
  constructor(
    @InjectRepository(PlayerInSession)
    private readonly playerInSessionRepository: Repository<PlayerInSession>,
    private readonly playerCardsService: PlayerCardService,
  ) {}

  findOne(options?: FindOneOptions): Promise<PlayerInSession> {
    return this.playerInSessionRepository.findOne(options)
  }

  create(playerInSession: PlayerInSessionCreateDto) {
    return this.playerInSessionRepository.save(playerInSession)
  }

  async createOrUpdate(
    playerInSession: Partial<PlayerInSession>,
  ): Promise<PlayerInSession> {
    const row = (await this.findOne({ where: playerInSession })) || {}
    return this.playerInSessionRepository.save({ ...row, ...playerInSession })
  }

  update(where: { [key: string]: any }, update: { [key: string]: any }) {
    return this.playerInSessionRepository.update(where, update)
  }

  async remove(where: { [key: string]: any }) {
    const playerSessions = await this.playerInSessionRepository.find(where)

    playerSessions.forEach(async playerSession => {
      await this.playerCardsService.remove({ playerSession })
      await this.playerInSessionRepository.delete(playerSession.id)
    })
  }

  async playCards({
    user,
    cards,
    session,
    round,
  }: {
    user: User
    cards: Card[]
    session: Session
    round: number
  }) {
    const playerSession = await this.create({
      player: user,
      session,
    })

    await this.playerCardsService.create({
      round,
      playerSession,
      cards,
    })

    return this.playerInSessionRepository.findOne(playerSession.id, {
      relations: ['playerCards', 'playerCards.cards'],
    })
  }
}
