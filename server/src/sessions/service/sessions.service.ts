import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Session } from '../session.entity'
import { Repository, QueryBuilder } from 'typeorm'
import { Socket } from 'socket.io'
import { from, Observable } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import { WsResponse } from '@nestjs/websockets'
import { GameJoinDto } from '../../games/game.dto'
import { CardsService } from '../../cards/service/cards.service'
import { CardViewDto } from '../../cards/card.dto'
import { User } from '../../users/user.entity'
import { PlayerSessionService } from '../../player-session/service/player-session.service'
import { PlayerInSession } from '../../player-session/player-session.entity'

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
    // Construct room name.
    const room = this.getRoomName(game)

    // Join socket room.
    client.join(room)

    const session = this.createSession(user, game, room)

    return from(session).pipe(
      tap(session => console.log(session)),
      map(item => ({ event: 'session-join', data: item })),
    )
  }

  exitGame(
    client: Socket,
    { game }: { user: User; game: GameJoinDto },
  ): Observable<WsResponse<Session>> {
    const room = this.getRoomName(game)
    const session = this.sessionRepository.findOneOrFail({ room })

    client.leave(room)

    return from(session).pipe(
      map(item => ({ event: 'session-exit', data: item })),
    )
  }

  playCards(
    client: Socket,
    data: { user: User; session: Session; cards: CardViewDto[] },
  ): Observable<WsResponse<PlayerInSession>> {
    const playerInSession = this.playerInSessionsService.playCards(data)

    return from(playerInSession).pipe(
      tap(item => {
        client.broadcast
          .to(client.rooms[data.session.room])
          .emit('session-play-card', item)
      }),
      map(item => ({ event: 'session-play-card', data: item })),
    )
  }

  private getRoomName(game: GameJoinDto) {
    return `${game.id}-${game.name.replace(' ', '-')}`
  }

  private addPlayerToSession(user: User, session: Session) {
    return this.playerInSessionsService.create({
      playerId: user.id,
      sessionId: session.id,
    })
  }

  private getSession(room: string): Promise<Session> {
    return this.sessionRepository
      .createQueryBuilder('session')
      .leftJoinAndSelect('session.game', 'game')
      .leftJoinAndSelect('session.currentCard', 'card')
      .leftJoinAndSelect(qb => {
        return qb.select().from(PlayerInSession, 'playerSession')
        // .leftJoinAndSelect('playerSession.playerCards', 'player_in_card')
      }, 'session.playerInSession')
      .where({ room })
      .getOne()
  }

  private async createSession(
    user: User,
    game: GameJoinDto,
    room: string,
  ): Promise<Session> {
    let session = await this.sessionRepository.findOne({ where: { room } })

    if (!session) {
      const [currentCard] = await this.cardsService.findAll({
        skip: 0,
        take: 1,
        type: 'Q',
      })

      // Save session details for later usage.
      session = await this.sessionRepository.save({
        room,
        game,
        currentCard,
      })
    }

    await this.addPlayerToSession(user, session)

    return this.getSession(room)
  }
}
