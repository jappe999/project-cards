import {
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets'
import { Socket } from 'socket.io'
import { Observable } from 'rxjs'
import { Game } from '../../games/game.entity'
import { SessionsService } from '../service/sessions.service'
import { Session } from '../session.entity'
import { CardViewDto } from 'server/src/cards/card.dto'
import { UseGuards } from '@nestjs/common'
import { WsJwtGuard } from '../../auth/guard/ws-jwt.guard'
import { User } from 'server/src/users/user.entity'
import { PlayerInSession } from 'server/src/player-session/player-session.entity'

@WebSocketGateway()
export class SessionsGateway {
  constructor(private sessionsService: SessionsService) {}

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
  ): Observable<WsResponse<Session>> {
    return this.sessionsService.exitGame(client, payload)
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('session-play-card')
  playCards(
    client: Socket,
    payload: { user: User; session: Session; cards: CardViewDto[] },
  ): Observable<WsResponse<PlayerInSession>> {
    return this.sessionsService.playCards(client, payload)
  }
}
