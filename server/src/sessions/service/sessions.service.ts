import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Session } from '../session.entity'
import { Repository } from 'typeorm'
import { Socket } from 'socket.io'
import { from, Observable } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import { WsResponse } from '@nestjs/websockets'
import { GameJoinDto } from '../../games/game.dto'
import { CardsService } from '../../cards/service/cards.service'
import { User } from '../../users/user.entity'
import { PlayerSessionService } from '../../player-session/service/player-session.service'
import { PlayerInSession } from '../../player-session/player-session.entity'
import { SessionData } from '../session.types'
import { GamesService } from '../../games/service/games.service'

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    private readonly cardsService: CardsService,
    private readonly gamesService: GamesService,
    private readonly playerInSessionsService: PlayerSessionService,
  ) {}

  /**
   * Let a user join a particular game.
   *
   * @param client - The socket.IO client
   * @param game - The game to join
   */
  joinGame(
    client: Socket,
    { user, game }: { user: User; game: GameJoinDto },
  ): Observable<WsResponse<Session>> {
    const room = game.roomName
    const session = this.createSession(user, game, room)

    client.join(room)

    return from(session).pipe(
      tap(session => {
        client.broadcast.to(session.room).emit('session-join', session)
      }),
      map(data => ({ event: 'session-join', data })),
    )
  }

  /**
   * Remove the user from the game session and notify other players.
   *
   * @param client - The socket client of the connected user.
   * @param payload - The payload sent with the socket request.
   * @param payload.user - The user that is about to exit the game.
   * @param payload.game - The game the user is leaving.
   */
  exitGame(
    client: Socket,
    { user, game }: { user: User; game: GameJoinDto },
  ): Observable<WsResponse<{ user: User; session: Session }>> {
    const room = game.roomName
    const session = this.exitRoom(client, user, room)

    return from(session).pipe(
      tap(session => {
        client.broadcast
          .to(session.room)
          .emit('session-exit', { user, session })
      }),
      map(session => ({ event: 'session-exit', data: { user, session } })),
    )
  }

  /**
   * Play the cards for this round for the connected user.
   *
   * @param client - The socket client of the connected user.
   * @param payload - The payload sent with the socket request.
   */
  playCards(
    client: Socket,
    payload: SessionData,
  ): Observable<WsResponse<PlayerInSession>> {
    const playerInSession = this.playerInSessionsService.playCards(payload)

    return from(playerInSession).pipe(
      tap(item => {
        client.broadcast
          .to(payload.session.room)
          .emit('session-play-card', item)
      }),
      map(item => ({ event: 'session-play-card', data: item })),
    )
  }

  /**
   * Choose the cards that are the best combination.
   *
   * @param client - The socket client of the connected user.
   * @param payload - The payload sent with the socket request.
   */
  chooseCardCombination(
    client: Socket,
    payload: SessionData,
  ): Observable<WsResponse<SessionData>> {
    return from([payload]).pipe(
      tap(item => {
        client.broadcast
          .to(payload.session.room)
          .emit('session-choose-card-combination', item)
      }),
      map(data => ({ event: 'session-choose-card-combination', data })),
    )
  }

  /**
   * Start the next round of the game.
   *
   * @param client - The socket client of the connected user.
   * @param payload - The payload with session sent with the socket request.
   */
  nextRound(
    client: Socket,
    { session }: { session: Session },
  ): Observable<WsResponse<Session>> {
    const newSession = this.setupSessionForNextRound(session)

    return from(newSession).pipe(
      tap(item => {
        client.broadcast.to(session.room).emit('session-next-round', item)
      }),
      map(item => ({ event: 'session-next-round', data: item })),
    )
  }

  /**
   * Setup the session for the next round of the game.
   *
   * @param session - The current session of the game.
   */
  async setupSessionForNextRound(session: Session): Promise<Session> {
    session.currentRound++
    await this.setupSession(session)
    await this.chooseCzar(session)
    return this.getSession(session.id)
  }

  /**
   * Add a new player to the session and remove it's old sessions.
   *
   * @param user - The user to add to the session.
   * @param session - The session to add the user to.
   */
  async addPlayerToSession(
    user: User,
    session: Session,
  ): Promise<PlayerInSession> {
    const playerSession = {
      playerId: user.id,
      sessionId: session.id,
    }
    await this.playerInSessionsService.remove(playerSession)
    return this.playerInSessionsService.create(playerSession)
  }

  /**
   * Choose a (new) czar for this session.
   * @param session - The session to choose the Czar for.
   */
  async chooseCzar(session: Session): Promise<void> {
    const playersInSession = await this.playerInSessionsService.find({
      where: { session },
    })

    const nextCzarId = this.getNextCzarId(session, playersInSession)

    if (nextCzarId !== session.currentCzarId) {
      this.sessionRepository.update(session.id, {
        currentCzarId: nextCzarId,
      })
    }
  }

  private getNextCzarId(
    { currentCzarId }: Session,
    playersInSession: PlayerInSession[],
  ) {
    if (playersInSession.length === 0) {
      return null
    }

    let currentCzarIndex: number = -1

    if (currentCzarId) {
      currentCzarIndex = playersInSession.findIndex(
        ({ playerId: id }) => currentCzarId === id,
      )
      if (currentCzarIndex + 1 === playersInSession.length) {
        currentCzarIndex = -1
      }
    }

    const nextCzar = playersInSession[currentCzarIndex + 1]

    return nextCzar ? nextCzar.playerId : null
  }

  /**
   * Get a full session object.
   *
   * @param id - The id of the session.
   */
  getSession(id: string): Promise<Session> {
    return this.sessionRepository.findOne(id, {
      relations: [
        'game',
        'currentCard',
        'playerInSession',
        'playerInSession.player',
        'playerInSession.playerCards',
        'playerInSession.playerCards.cards',
      ],
    })
  }

  /**
   * Setup a new session or update an existing one.
   *
   * @param payload - The payload needed to setup the session.
   * @param payload.id - The id of the session.
   * @param payload.game - The game of the session.
   * @param payload.room - The roomname of the game.
   */
  async setupSession({
    id,
    game,
    room,
    currentRound = 0,
  }: {
    id?: string
    game: GameJoinDto
    room: string
    currentRound?: number
  }) {
    const [currentCard] = await this.cardsService.findAll({
      skip: 0,
      take: 1,
      type: 'Q',
    })

    return this.sessionRepository.save({
      id,
      game,
      room,
      currentCard,
      currentRound,
    })
  }

  /**
   * Create or update a session and add the user to it.
   *
   * @param user - The authenticated user.
   * @param game - The game to create the session for.
   * @param room - The name of the room.
   */
  async createSession(
    user: User,
    game: GameJoinDto,
    room: string,
  ): Promise<Session> {
    let session = await this.sessionRepository.findOne({ where: { room } })

    if (!session) {
      session = await this.setupSession({ game, room })
    }

    await this.addPlayerToSession(user, session)
    if (!session.currentCzarId) {
      await this.chooseCzar(session)
    }

    return this.getSession(session.id)
  }

  /**
   * Remove the user from session.
   *
   * @param client - The socket client.
   * @param user - The authenticated user.
   * @param room - The name of the game room.
   */
  async exitRoom(client: Socket, user: User, room: string) {
    client.leave(room)

    const session = await this.sessionRepository.findOne({ where: { room } })

    if (session.currentCzarId === user.id) {
      await this.chooseCzar(session)
    }

    await this.playerInSessionsService.remove({
      playerId: user.id,
      sessionId: session.id,
    })

    return this.getSession(session.id)
  }
}
