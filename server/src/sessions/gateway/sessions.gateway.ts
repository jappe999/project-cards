import {
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
  OnGatewayDisconnect,
} from '@nestjs/websockets'
import { Socket } from 'socket.io'
import { Observable } from 'rxjs'
import { Game } from '../../games/game.entity'
import { SessionsService } from '../service/sessions.service'
import { Session } from '../session.entity'
import { UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { CardViewDto } from 'server/src/cards/card.dto'

@WebSocketGateway()
export class SessionsGateway implements OnGatewayDisconnect {
  constructor(private sessionsService: SessionsService) {}

  handleDisconnect(client: Socket) {}

  @SubscribeMessage('session-join')
  joinSession(client: Socket, game: Game): Observable<WsResponse<Session>> {
    return this.sessionsService.joinGame(client, game)
  }

  @SubscribeMessage('session-exit')
  exitSession(client: Socket, game: Game): Observable<WsResponse<Session>> {
    return this.sessionsService.exitGame(client, game)
  }

  @SubscribeMessage('session-play-card')
  playCard(
    client: Socket,
    payload: { session: Session; cards: CardViewDto[] },
  ): Observable<WsResponse<CardViewDto[]>> {
    return this.sessionsService.playCard(client, payload)
  }
}
