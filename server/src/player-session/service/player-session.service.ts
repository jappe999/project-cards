import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, FindOneOptions, FindManyOptions } from 'typeorm'
import { PlayerInSession } from '../player-session.entity'
import { PlayerCardService } from '../../player-card/service/player-card.service'
import { PlayerInSessionCreateDto } from '../player-session.dto'
import { SessionData } from 'server/src/sessions/session.types'

@Injectable()
export class PlayerSessionService {
  constructor(
    @InjectRepository(PlayerInSession)
    private readonly playerInSessionRepository: Repository<PlayerInSession>,
    private readonly playerCardsService: PlayerCardService,
  ) {}

  /**
   * Find a specific player session.
   * @param options - The query for finding the player session.
   */
  findOne(options?: FindOneOptions): Promise<PlayerInSession> {
    return this.playerInSessionRepository.findOne(options)
  }

  /**
   * Find a specific player session.
   * @param options - The query for finding the player session.
   */
  find(options?: FindManyOptions): Promise<PlayerInSession[]> {
    return this.playerInSessionRepository.find(options)
  }

  /**
   * Create a new player session.
   * @param playerInSession - The player session to create.
   */
  create(playerInSession: Partial<PlayerInSession>) {
    return this.playerInSessionRepository.save(playerInSession)
  }

  /**
   * Find or create a player session.
   * @param playerInSession - The player session object to find.
   */
  async findOrCreate(
    playerInSession: Partial<PlayerInSession>,
  ): Promise<PlayerInSession> {
    const { player, session } = playerInSession
    let previousPlayerSession: PlayerInSession

    if (player && session) {
      previousPlayerSession = await this.findOne({
        where: { playerId: player.id, sessionId: session.id },
      })
    }

    if (previousPlayerSession) {
      return previousPlayerSession
    } else {
      return this.playerInSessionRepository.save(playerInSession)
    }
  }

  /**
   * Update specific player sessions.
   * @param where - The query for replacing specific player sessions.
   * @param update - The new data for the queried player sessions.
   */
  update(where: { [key: string]: any }, update: { [key: string]: any }) {
    return this.playerInSessionRepository.update(where, update)
  }

  /**
   * Remove a player session.
   * @param where - The query to what to remove from the player sessions.
   */
  async remove(where: { [key: string]: any }) {
    const playerSessions = await this.playerInSessionRepository.find(where)

    playerSessions.forEach(async playerSession => {
      await this.playerCardsService.remove({ playerSession })
      await this.playerInSessionRepository.delete(playerSession.id)
    })
  }

  /**
   * Save the given cards as the cards played by the user in this round.
   * @param payload
   * @param payload.user - The user who played the cards.
   * @param payload.cards - The cards that are played.
   * @param payload.round - The round that the cards are played in.
   */
  async playCards({ user: player, cards, session, round }: SessionData) {
    const playerSession = await this.findOrCreate({ player, session })

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
