import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Session } from '../session.entity'
import { Repository } from 'typeorm'
import { Socket } from 'socket.io'
import { from, Observable, throwError } from 'rxjs'
import { map, tap, catchError } from 'rxjs/operators'
import { WsResponse } from '@nestjs/websockets'
import { GameJoinDto } from '../../games/game.dto'
import { CardsService } from '../../cards/service/cards.service'
import { User } from '../../users/user.entity'
import { PlayerSessionService } from '../../player-session/service/player-session.service'
import { PlayerInSession } from '../../player-session/player-session.entity'
import { CardViewDto } from 'server/src/cards/card.dto'

type CardData = {
  user: User
  session: Session
  cards: CardViewDto[]
  round: number
}

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    private readonly cardsService: CardsService,
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
    const room = this.getRoomName(game)

    client.join(room)

    const session = this.createSession(user, game, room)

    return from(session).pipe(map(data => ({ event: 'session-join', data })))
  }

  /**
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
    const room = this.getRoomName(game)
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

  playCards(
    client: Socket,
    data: CardData,
  ): Observable<WsResponse<PlayerInSession>> {
    const playerInSession = this.playerInSessionsService.playCards(data)

    return from(playerInSession).pipe(
      tap(item => {
        client.broadcast.to(data.session.room).emit('session-play-card', item)
      }),
      map(item => ({ event: 'session-play-card', data: item })),
    )
  }

  chooseCardCombination(
    client: Socket,
    data: CardData,
  ): Observable<WsResponse<CardData>> {
    return from([data]).pipe(
      tap(item => {
        client.broadcast
          .to(data.session.room)
          .emit('session-choose-card-combination', item)
      }),
      map(data => ({ event: 'session-choose-card-combination', data })),
    )
  }

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

  async setupSessionForNextRound(session: Session): Promise<Session> {
    await this.setupSession(session)
    return this.getSession({ id: session.id })
  }

  private getRoomName(game: GameJoinDto) {
    return `${game.id}-${game.name.replace(' ', '-')}`
  }

  addPlayerToSession(user: User, session: Session) {
    return this.playerInSessionsService.create({
      playerId: user.id,
      sessionId: session.id,
    })
  }

  getSession(where: { [key: string]: any }): Promise<Session> {
    return this.sessionRepository.findOne({
      relations: [
        'game',
        'currentCard',
        'playerInSession',
        'playerInSession.playerCards',
        'playerInSession.playerCards.cards',
      ],
      where,
    })
  }

  async setupSession({
    id,
    game,
    room,
  }: {
    id?: string
    game: GameJoinDto
    room: string
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
    })
  }

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
    return this.getSession({ id: session.id })
  }

  async exitRoom(client: Socket, user: User, room: string) {
    client.leave(room)

    const session = await this.sessionRepository.findOne({ where: { room } })

    await this.playerInSessionsService.remove({
      playerId: user.id,
      sessionId: session.id,
    })

    return this.getSession({ id: session.id })
  }
}
