import {
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
  OnGatewayDisconnect,
} from '@nestjs/websockets'
import { Socket } from 'socket.io'
import { Observable, from } from 'rxjs'
import { Game } from '../../games/game.entity'
import { SessionsService } from '../service/sessions.service'
import { Session } from '../session.entity'
import { CardViewDto } from '../../cards/card.dto'
import { UseGuards } from '@nestjs/common'
import { WsJwtGuard } from '../../auth/guard/ws-jwt.guard'
import { User } from '../../users/user.entity'
import { PlayerInSession } from '../../player-session/player-session.entity'
import { UsersService } from '../../users/service/users.service'
import { AuthService } from '../../auth/service/auth.service'

@WebSocketGateway()
export class SessionsGateway implements OnGatewayDisconnect {
  constructor(
    private sessionsService: SessionsService,
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  async handleDisconnect(client: Socket) {
    const { sub: id } = this.authService.getTokenFromWsClient(client)
    const { playerInSession, ...user } = await this.usersService.activeSessions(
      { id },
    )

    return playerInSession.forEach(({ session: { game } }) => {
      this.sessionsService
        .exitGame(client, {
          user: user as User,
          game,
        })
        .subscribe()
    })
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('session-join')
  joinSession(
    client: Socket,
    payload: { user: User; game: Game },
  ): Observable<WsResponse<Session>> {
    return this.sessionsService.joinGame(client, payload)
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('session-exit')
  exitSession(
    client: Socket,
    payload: { user: User; game: Game },
  ): Observable<WsResponse<{ user: User; session: Session }>> {
    return this.sessionsService.exitGame(client, payload)
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('session-play-card')
  playCards(
    client: Socket,
    payload: {
      user: User
      session: Session
      cards: CardViewDto[]
      round: number
    },
  ): Observable<WsResponse<PlayerInSession>> {
    return this.sessionsService.playCards(client, payload)
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('session-choose-card-combination')
  chooseCardCombination(
    client: Socket,
    payload: {
      user: User
      session: Session
      cards: CardViewDto[]
      round: number
    },
  ): Observable<
    WsResponse<{
      user: User
      session: Session
      cards: CardViewDto[]
      round: number
    }>
  > {
    return this.sessionsService.chooseCardCombination(client, payload)
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('session-next-round')
  nextRound(
    client: Socket,
    payload: { user: User; session: Session },
  ): Observable<WsResponse<Session>> {
    return this.sessionsService.nextRound(client, payload)
  }
}
