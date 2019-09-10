import { UseGuards, UsePipes } from '@nestjs/common'
import {
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
  OnGatewayDisconnect,
} from '@nestjs/websockets'
import { Socket } from 'socket.io'
import { Observable } from 'rxjs'
import { decode } from 'jsonwebtoken'
import { Game } from '../../games/game.entity'
import { SessionsService } from '../service/sessions.service'
import { Session } from '../session.entity'
import { WsJwtGuard } from '../../auth/guard/ws-jwt.guard'
import { User } from '../../users/user.entity'
import { PlayerInSession } from '../../player-session/player-session.entity'
import { UsersService } from '../../users/service/users.service'
import { AuthService } from '../../auth/service/auth.service'
import { SessionData } from '../session.types'
import { ValidationPipe } from '../../validation.pipe'

@WebSocketGateway()
export class SessionsGateway implements OnGatewayDisconnect {
  constructor(
    private sessionsService: SessionsService,
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  async handleDisconnect(client: Socket) {
    let { sub: id } = this.authService.getTokenFromWsClient(client)

    if (id === null) {
      const token = client.handshake.headers.authorization.split(' ').pop()
      const decoded = decode(token)
      id = decoded.sub
    }

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
  @UsePipes(new ValidationPipe({ user: User, game: Game }))
  joinSession(
    client: Socket,
    payload: { user: User; game: Game },
  ): Observable<WsResponse<Session>> {
    return this.sessionsService.joinGame(client, payload)
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('session-exit')
  @UsePipes(new ValidationPipe({ user: User, game: Game }))
  exitSession(
    client: Socket,
    payload: { user: User; game: Game },
  ): Observable<WsResponse<{ user: User; session: Session }>> {
    return this.sessionsService.exitGame(client, payload)
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('session-play-card')
  @UsePipes(new ValidationPipe(SessionData))
  playCards(
    client: Socket,
    payload: SessionData,
  ): Observable<WsResponse<PlayerInSession>> {
    return this.sessionsService.playCards(client, payload)
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('session-choose-card-combination')
  @UsePipes(new ValidationPipe(SessionData))
  chooseCardCombination(
    client: Socket,
    payload: SessionData,
  ): Observable<WsResponse<SessionData>> {
    return this.sessionsService.chooseCardCombination(client, payload)
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('session-next-round')
  @UsePipes(new ValidationPipe({ user: User, session: Session }))
  nextRound(
    client: Socket,
    payload: { user: User; session: Session },
  ): Observable<WsResponse<Session>> {
    return this.sessionsService.nextRound(client, payload)
  }
}
