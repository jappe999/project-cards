import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Session } from '../session.entity'
import { Repository } from 'typeorm'
import { Socket } from 'socket.io'
import { from, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { WsResponse } from '@nestjs/websockets'
import { GameJoinDto } from '../../games/game.dto'
import { CardsService } from '../../cards/service/cards.service'
import { CardViewDto } from '../../cards/card.dto'

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    private readonly cardsService: CardsService,
  ) {}

  /**
   * Let a user join a particular game.
   *
   * @param client - The socket.IO client
   * @param game - The game to join
   */
  joinGame(client: Socket, game: GameJoinDto): Observable<WsResponse<Session>> {
    // Construct room name.
    const room = this.getRoomName(game)

    // Join socket room.
    client.join(room)

    const session = this.createSession(game, room)

    return from(session).pipe(
      map(item => ({ event: 'session-join', data: item })),
    )
  }

  exitGame(client: Socket, game: GameJoinDto): Observable<WsResponse<Session>> {
    const room = this.getRoomName(game)
    const session = this.sessionRepository.findOneOrFail({ room })

    client.leave(room)

    return from(session).pipe(
      map(item => ({ event: 'session-exit', data: item })),
    )
  }

  playCard(
    client: Socket,
    { session, cards }: { session: Session; cards: CardViewDto[] },
  ): Observable<WsResponse<CardViewDto[]>> {
    client.broadcast
      .to(client.rooms[session.room])
      .emit('session-play-card', cards)

    return from([cards]).pipe(
      map(item => ({ event: 'session-play-card', data: item })),
    )
  }

  private getRoomName(game: GameJoinDto) {
    return `${game.id}-${game.name.replace(' ', '-')}`
  }

  private async createSession(
    game: GameJoinDto,
    room: string,
  ): Promise<Session> {
    let session = await this.sessionRepository
      .createQueryBuilder('session')
      .leftJoinAndSelect('session.game', 'game')
      .leftJoinAndSelect('session.currentCard', 'card')
      .leftJoinAndSelect('session.players', 'user')
      .where({ room })
      .getOne()

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

    return session
  }
}
